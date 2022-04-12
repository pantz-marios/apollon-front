import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges, Renderer2 } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { DragAndDropDirective } from '@modules/shared/directives/drag-and-drop.directive';





@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit {
  private _value: number = null;
  private _min: number = null;
  private _max: number = null;

  private readonly DEFAULT_MIN_VALUE = 0;
  private readonly DEFAULT_MAX_VALUE = 100;

  private readonly HOVER_CLASS = 'slider-hovered';
  private isDragging = false;
  private isMouseOver = false;

  public trackForegroundWidth = "0";
  public thumbYOffset = '0px';
  private resizeObserver: ResizeObserver = null;
  private subscriptions: Subscription = new Subscription();

  @ViewChild('sliderTrack', {static: true}) sliderTrack: ElementRef<HTMLElement>;
  @ViewChild('sliderThumb', {static: true}) sliderThumb: ElementRef<HTMLElement>;
  @ViewChild(DragAndDropDirective, {static: true}) sliderThumbDragAndDrop: DragAndDropDirective;

  @Input() public value: number;
  @Input() public min: number;
  @Input() public max: number;

  @Output() onValueChange = new EventEmitter<{value: number, changedProgrammatically: boolean}>();
  @Output() onDragStart = new EventEmitter();
  @Output() onDragEnd = new EventEmitter();
  @Output() onMouseOver = new EventEmitter<{value: number; x: number}>();



  constructor(
    private cd: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}



  public ngOnInit() {
    // check the @Input  'min' and 'max'  values
    this._min = this.min;
    this._max = this.max;
    if(this._min == null) {
      this._min = this.DEFAULT_MIN_VALUE;
    }
    if(this._max == null) {
      this._max = this.DEFAULT_MAX_VALUE;
    }
    if(this._min >= this._max) {
      this._min = this.DEFAULT_MIN_VALUE;
      this._max = this.DEFAULT_MAX_VALUE;
    }

    // get the bounding rect of the track and the thumb
    const sliderTrackEl = this.sliderTrack.nativeElement as HTMLElement;
    const sliderTrackRect = sliderTrackEl.getBoundingClientRect();
    const sliderThumbEl = this.sliderThumb.nativeElement as HTMLElement;
    const sliderThumbRect = sliderThumbEl.getBoundingClientRect();

    this.thumbYOffset = `${sliderTrackRect.height/2 - sliderThumbRect.height/2}px`;

    // when the user clicks on the slider track, move the thumb and start thumb dragging
    const sliderTrackEldMouseDownSubscription = fromEvent<MouseEvent>(sliderTrackEl, "mousedown").subscribe((e: MouseEvent) => this.onTrackMouseDown(e));
    this.subscriptions.add(sliderTrackEldMouseDownSubscription);

    // when the user moves the mouse over the slider track, raise an event
    const sliderTrackEldMouseMoveSubscription = fromEvent<MouseEvent>(sliderTrackEl, "mousemove").subscribe((e: MouseEvent) => this.onTrackMouseMove(e));
    this.subscriptions.add(sliderTrackEldMouseMoveSubscription);

    // when the user mouse enters the slider track
    const sliderTrackEldMouseEnterSubscription = fromEvent<MouseEvent>(sliderTrackEl, "mouseenter").subscribe((e: MouseEvent) => {
      this.isMouseOver = true;
      this.renderer.addClass(this.el.nativeElement, this.HOVER_CLASS);
    });
    this.subscriptions.add(sliderTrackEldMouseEnterSubscription);

    // when the user mouse leaves the slider track
    const sliderTrackEldMouseLeaveSubscription = fromEvent<MouseEvent>(sliderTrackEl, "mouseleave").subscribe((e: MouseEvent) => {
      this.isMouseOver = false;
      this.removeHoverClass();
    });
    this.subscriptions.add(sliderTrackEldMouseLeaveSubscription);


    // if the size of the component changes, update it
    this.resizeObserver = new ResizeObserver((entries) => { 
      entries.forEach(entry => this.onSizeChanged(entry.contentRect.width, entry.contentRect.height));
    });
    this.resizeObserver.observe(sliderTrackEl);
  }

  public ngOnChanges(changes: SimpleChanges) {
    // check the @Input  'min' and 'max'  values
    this._min = this.min;
    this._max = this.max;
    if(this._min == null) {
      this._min = this.DEFAULT_MIN_VALUE;
    }
    if(this._max == null) {
      this._max = this.DEFAULT_MAX_VALUE;
    }
    if(this._min >= this._max) {
      this._min = this.DEFAULT_MIN_VALUE;
      this._max = this.DEFAULT_MAX_VALUE;
    }

    // if input 'min' or 'max' has been changed, update slider's thumb position and track's background width
    if((changes['min'] || changes['max'])) {
      this.update();
    }

    // if input 'value', update slider's value, thumb position and track's background width
    if(changes['value']) {
      this.setValue(this.value, true);
      this.update();
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.resizeObserver.unobserve(this.sliderTrack.nativeElement);
  }



  /**
   * 
   * Update thumb's position and track's background width.
   * 
   */
  private update() {
    // get the bounding rect of the track and the thumb
    const sliderTrackEl = this.sliderTrack.nativeElement as HTMLElement;
    const sliderTrackRect = sliderTrackEl.getBoundingClientRect();
    const sliderThumbEl = this.sliderThumb.nativeElement as HTMLElement;
    const sliderThumbRect = sliderThumbEl.getBoundingClientRect();

    // thumb's min and max x coordinate
    const minValue = - SliderComponent.sliderThumbTrackXOffset(sliderThumbRect.width);
    const maxValue = sliderTrackRect.width - sliderThumbRect.width + SliderComponent.sliderThumbTrackXOffset(sliderThumbRect.width);

    // get slider's new x coordinate
    let newX = SliderComponent.mapValueInRange(this._value, this._min, this._max, minValue, maxValue);
    const newY = 0;

    // make sure the thumb will not move outside the track bounds
    if(newX < minValue) {
      newX = minValue;
    }
    if(newX > maxValue) {
      newX = maxValue;
    }

    // update thumb's x coordinate
    this.sliderThumbDragAndDrop.updateValue(newX, newY);

    // update track's foreground width
    this.trackForegroundWidth = `${newX+SliderComponent.sliderThumbTrackXOffset(sliderThumbRect.width)}px`;
    this.cd.detectChanges();
  }

  private setValue(value: number, changedProgrammatically: boolean) {
    this._value = value;
    this.onValueChange.emit({value: this._value, changedProgrammatically: changedProgrammatically});
  }



  private onSizeChanged(width: number, height: number) {
    this.update();
  }

  private onTrackMouseDown(e: MouseEvent) {
    // get the bounding rect of the track and the thumb
    const sliderTrackEl = this.sliderTrack.nativeElement as HTMLElement;
    const sliderTrackRect = sliderTrackEl.getBoundingClientRect();
    const sliderThumbEl = this.sliderThumb.nativeElement as HTMLElement;
    const sliderThumbRect = sliderThumbEl.getBoundingClientRect();

    // if the user clicked on the slider thumb, do not continue, it will be handled by DragAndDropDirective
    if(e.target === sliderThumbEl) {
      return;
    }

    // calculate the new thumb's x coordinate
    const newX = e.clientX - sliderTrackRect.left - sliderThumbRect.width/2;

    // update thumb's x coordinate, start dragging and update
    this.sliderThumbDragAndDrop.updateValue(newX, 0);
    this.sliderThumbDragAndDrop.mouseDown(e);
    this.onDrag({x: newX, y: 0});

    this.isDragging = true;
    this.onDragStart.emit();
  }

  private onTrackMouseMove(e: MouseEvent) {
    // get the bounding rect of the track and the thumb
    const sliderTrackEl = this.sliderTrack.nativeElement as HTMLElement;
    const sliderTrackRect = sliderTrackEl.getBoundingClientRect();
    const sliderThumbEl = this.sliderThumb.nativeElement as HTMLElement;
    const sliderThumbRect = sliderThumbEl.getBoundingClientRect();

    // thumb's min and max x coordinate
    const minValue = -SliderComponent.sliderThumbTrackXOffset(sliderThumbRect.width);
    const maxValue = sliderTrackRect.width - sliderThumbRect.width + SliderComponent.sliderThumbTrackXOffset(sliderThumbRect.width);

    // calculate the new thumb's x coordinate
    const mouseOverX = e.clientX - sliderTrackRect.left - sliderThumbRect.width/2;

    // make sure the thumb will not move outside the track bounds
    let x = mouseOverX;
    if(mouseOverX < minValue) {
      x = minValue;
    }
    if(mouseOverX > maxValue) {
      x = maxValue;
    }

    // calculate the slider's value that mouse over
    const value = SliderComponent.mapValueInRange(x, minValue, maxValue, this._min, this._max);
    
    this.onMouseOver.emit({value: value, x: mouseOverX});
  }

  public onDrag(e: {x: number, y: number}) {
    // get the bounding rect of the track and the thumb
    const sliderTrackEl = this.sliderTrack.nativeElement as HTMLElement;
    const sliderTrackRect = sliderTrackEl.getBoundingClientRect();
    const sliderThumbEl = this.sliderThumb.nativeElement as HTMLElement;
    const sliderThumbRect = sliderThumbEl.getBoundingClientRect();

    // thumb's min and max x coordinate
    const minValue = -SliderComponent.sliderThumbTrackXOffset(sliderThumbRect.width);
    const maxValue = sliderTrackRect.width - sliderThumbRect.width + SliderComponent.sliderThumbTrackXOffset(sliderThumbRect.width);

    // make sure the thumb will not move outside the track bounds
    let x = e.x;
    let y = 0;
    if(e.x < minValue) {
      x = minValue;
    }
    if(e.x > maxValue) {
      x = maxValue;
    }

    // update thumb's x coordinate
    this.sliderThumbDragAndDrop.updateValue(x, y);

    // update track's foreground width
    this.trackForegroundWidth = `${x+SliderComponent.sliderThumbTrackXOffset(sliderThumbRect.width)}px`;
    this.cd.markForCheck();

    // calculate and set slider's new value
    const value = SliderComponent.mapValueInRange(x, minValue, maxValue, this._min, this._max);
    this.setValue(value, false);

    this.onMouseOver.emit({value: value, x: x});
  }

  public onSliderThumDragStart() {
    this.isDragging = true;
    this.onDragStart.emit();
  }

  public onSliderThumDragEnd() {
    this.isDragging = false;
    this.removeHoverClass();
    this.onDragEnd.emit();
  }

  private static mapValueInRange(oldValue, oldMin, oldMax, newMin, newMax) {
    return ((oldValue - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
  }

  private static sliderThumbTrackXOffset(thumbWidth: number): number {
    // // foreground will end at the start of the thumb
    // return 0;

    // foreground will end at the center of the thumb
    return thumbWidth / 2;
  }

  private removeHoverClass() {
    if(this.isMouseOver || this.isDragging) {
      return;
    }

    this.renderer.removeClass(this.el.nativeElement, this.HOVER_CLASS);
  }

}