import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';





@Component({
  selector: 'player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerControlsComponent implements OnInit {

  @ViewChild('seekSliderTooltip', {static: true}) seekSliderTooltip: ElementRef<HTMLDivElement>;
  
  @Input() public seekSliderValue: number;
  @Input() public seekSliderMaxValue: number;
  @Input() public seekSliderTooltipValue: number;
  @Input() public isPaused: boolean;
  @Input() public isVolumeOff: boolean;
  @Input() public isVolumeDown: boolean;
  @Input() public isVolumeUp: boolean;
  @Input() public volumeSliderValue: number;
  @Input() public elapsedTimeSecs: number;
  @Input() public durationSecs: number;
  @Input() public fullscreenEnabled: boolean;
  @Input() public isFullScreenActive: boolean;
  @Input() public videoTitle: boolean;
  @Input() public videoArtist: boolean;

  @Output() onSeekSliderValueChange = new EventEmitter<{value: number, changedProgrammatically: boolean}>();
  @Output() onSeekSliderDragStart = new EventEmitter();
  @Output() onSeekSliderDragEnd = new EventEmitter();
  @Output() playPauseButtonClicked = new EventEmitter();
  @Output() playPreviousButtonClicked = new EventEmitter();
  @Output() playNextButtonClicked = new EventEmitter();
  @Output() volumeButtonClicked = new EventEmitter();
  @Output() onVolumeSliderValueChange = new EventEmitter<{value: number, changedProgrammatically: boolean}>();
  @Output() fullscreenButtonClicked = new EventEmitter();
  


  constructor(
    private cd: ChangeDetectorRef
  ) {}



  public ngOnInit() {

  }

  public ngOnDestroy() {

  }



  public _onSeekSliderValueChange(e: {value: number, changedProgrammatically: boolean}) {
    this.onSeekSliderValueChange.emit(e);
  }

  public _onSeekSliderDragStart() {
    this.onSeekSliderDragStart.emit();
  }

  public _onSeekSliderDragEnd() {
    this.onSeekSliderDragEnd.emit();
  }

  public onSeekSliderMouseOver(e: {value: number; x: number}) {
    const {value, x} = e;
    const seekSliderTooltipRect = this.seekSliderTooltip.nativeElement.getBoundingClientRect();
    const tooltipPosition = x - seekSliderTooltipRect.width/2;

    this.seekSliderTooltipValue = value;
    this.seekSliderTooltip.nativeElement.style.left = `${tooltipPosition}px`;
    this.cd.markForCheck();
  }

  public _playPauseButtonClicked() {
    this.playPauseButtonClicked.emit();
  }

  public _playPreviousButtonClicked() {
    this.playPreviousButtonClicked.emit();
  }

  public _playNextButtonClicked() {
    this.playNextButtonClicked.emit();
  }

  public _volumeButtonClicked() {
    this.volumeButtonClicked.emit();
  }

  public _onVolumeSliderValueChange(e: {value: number, changedProgrammatically: boolean}) {
    this.onVolumeSliderValueChange.emit(e);
  }

  public _fullscreenButtonClicked() {
    this.fullscreenButtonClicked.emit();
  }

}