import { Directive, ElementRef, EventEmitter, Inject, Input, Output } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { fromEvent, Subscription } from "rxjs";





@Directive({
  selector: "[drag-and-drop]"
})
export class DragAndDropDirective {
  private element: HTMLElement;

  private initialX = 0;
  private initialY = 0;
  private currentX = 0;
  private currentY = 0;

  private mouseDownSubscription: Subscription = null;
  private mouseUpSubscription: Subscription = null;
  private mouseMoveSubscription: Subscription = null;

  @Input() public autoUpdate: boolean;

  @Output() onDrag = new EventEmitter();
  @Output() onDragStart = new EventEmitter();
  @Output() onDragEnd = new EventEmitter();



  constructor(
    private readonly el: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: any
  ) {}



  public ngOnInit(): void {
    this.element = this.el.nativeElement as HTMLElement;

    this.initDrag();
  }

  public ngOnDestroy(): void {
    if(this.mouseDownSubscription != null) {
      this.mouseDownSubscription.unsubscribe();
      this.mouseDownSubscription = null;
    }
  }



  private initDrag() {
    this.mouseDownSubscription = fromEvent<MouseEvent>(this.element, "mousedown").subscribe((e: MouseEvent) => this.onMouseDown(e));
  }

  private onMouseDown(e: MouseEvent) {
    this.initialX = e.clientX - this.currentX;
    this.initialY = e.clientY - this.currentY;

    this.mouseUpSubscription = fromEvent<MouseEvent>(this.document, "mouseup").subscribe((e: MouseEvent) => this.onMouseUp(e));
    this.mouseMoveSubscription = fromEvent<MouseEvent>(this.document, "mousemove").subscribe((e: MouseEvent) => this.onMouseMove(e));

    this.onDragStart.emit();
  }

  private onMouseUp(e: MouseEvent) {
    this.initialX = this.currentX;
    this.initialY = this.currentY;

    if(this.mouseMoveSubscription != null) {
      this.mouseMoveSubscription.unsubscribe();
      this.mouseMoveSubscription = null;
    }

    if(this.mouseUpSubscription != null) {
      this.mouseUpSubscription.unsubscribe();
      this.mouseUpSubscription = null;
    }

    this.onDragEnd.emit();
  }

  private onMouseMove(e: MouseEvent) {
    this.currentX = e.clientX - this.initialX;
    this.currentY = e.clientY - this.initialY;
    
    if(this.autoUpdate == null || (this.autoUpdate != null && this.autoUpdate)) {
      this.element.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0px)`;
    }

    this.onDrag.emit({x: this.currentX, y: this.currentY});
  }



  public updateValue(x: number, y: number) {
    this.currentX = x;
    this.currentY = y;

    if(this.element) {
      this.element.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0px)`;
    }
  }

  public mouseDown(e: MouseEvent) {
    this.initialX = e.clientX - this.currentX;
    this.initialY = e.clientY - this.currentY;

    this.mouseUpSubscription = fromEvent<MouseEvent>(this.document, "mouseup").subscribe((e: MouseEvent) => this.onMouseUp(e));
    this.mouseMoveSubscription = fromEvent<MouseEvent>(this.document, "mousemove").subscribe((e: MouseEvent) => this.onMouseMove(e));
  }

}