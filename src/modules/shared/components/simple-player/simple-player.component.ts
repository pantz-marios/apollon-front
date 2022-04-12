import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subscription } from "rxjs";





@Component({
  selector: 'simple-player',
  templateUrl: './simple-player.component.html',
  styleUrls: ['./simple-player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimplePlayerComponent implements OnInit {
  public videoSrc = null;
  public videoType = null;

  public seekSliderValue = 0;
  public seekSliderMaxValue = 0;
  public volumeSliderValue = 1;
  public isPaused = true;
  public isVolumeOff = false;
  public isVolumeDown = false;
  public isVolumeUp = false;
  public elapsedTimeSecs = 0;
  public durationSecs = null;
  public fullscreenEnabled = false;
  public isFullScreenActive = false;
  public seekSliderTooltipValue = 0;

  private playOnDragEnd = false;

  private html5PlayerEventsSubscription: Subscription = new Subscription();
  private onEventSubscription: Subscription = new Subscription();

  private onEventObserved: BehaviorSubject<{type: string; data: any}> = new BehaviorSubject(null);
  private onEventObservable: Observable<{type: string; data: any}> = this.onEventObserved.asObservable();

  private onVideoEnded: BehaviorSubject<void> = new BehaviorSubject(null);
  public onVideoEnded$: Observable<void> = this.onVideoEnded.asObservable();

  @ViewChild('simplePlayerContainer', {static: true}) simplePlayerContainer: ElementRef<HTMLDivElement>;
  @ViewChild('videoPlayer', {static: true}) videoPlayer: ElementRef<HTMLVideoElement>;
  @ViewChild('seekSliderTooltip', {static: false}) seekSliderTooltip: ElementRef<HTMLDivElement>;

  @Input() public poster: string;
  @Input() public controls: boolean;

  
  
  constructor(
    private cd: ChangeDetectorRef
  ) {}



  public ngOnInit() {
    this.videoPlayerEventHandling();
    this.html5VideoPlayerEventsSubscribe();

    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.updateVolumeControls(videoPlayer.volume, videoPlayer.muted);

    this.fullscreenEnabled = this.isFullscreenEnabled();
  }

  public ngOnDestroy() {
    this.onEventSubscription.unsubscribe();
    this.html5PlayerEventsSubscription.unsubscribe();
  }



  /**
   * 
   * Subscribe to HTML5 video player events and "publish" them through the 'onEventObserved' BehaviorSubject.
   * 
   */
  private html5VideoPlayerEventsSubscribe() {
    const loadedmetadataEventSub = fromEvent(this.videoPlayer.nativeElement, 'loadedmetadata').subscribe((e: any) => {
      this.onEventObserved.next({type: 'loadedmetadata', data: e});
    });
    this.html5PlayerEventsSubscription.add(loadedmetadataEventSub);

    const timeupdateEventSub = fromEvent(this.videoPlayer.nativeElement, 'timeupdate').subscribe((e: any) => {
      this.onEventObserved.next({type: 'timeupdate', data: this.videoPlayer.nativeElement.currentTime});
    });
    this.html5PlayerEventsSubscription.add(timeupdateEventSub);

    const progressEventSub = fromEvent(this.videoPlayer.nativeElement, 'progress').subscribe((e: any) => {
      this.onEventObserved.next({type: 'progress', data: e});
    });
    this.html5PlayerEventsSubscription.add(progressEventSub);

    const volumechangeEventSub = fromEvent(this.videoPlayer.nativeElement, 'volumechange').subscribe((e: any) => {
      this.onEventObserved.next({type: 'volumechange', data: this.videoPlayer.nativeElement.volume});
    });
    this.html5PlayerEventsSubscription.add(volumechangeEventSub);

    const playEventSub = fromEvent(this.videoPlayer.nativeElement, 'play').subscribe((e: any) => {
      this.onEventObserved.next({type: 'play', data: e});
    });
    this.html5PlayerEventsSubscription.add(playEventSub);

    const pauseEventSub = fromEvent(this.videoPlayer.nativeElement, 'pause').subscribe((e: any) => {
      this.onEventObserved.next({type: 'pause', data: e});
    });
    this.html5PlayerEventsSubscription.add(pauseEventSub);

    const endedEventSub = fromEvent(this.videoPlayer.nativeElement, 'ended').subscribe((e: any) => {
      this.onEventObserved.next({type: 'ended', data: e});
    });
    this.html5PlayerEventsSubscription.add(endedEventSub);

    const fullscreenchangeEventSub = fromEvent(document, 'fullscreenchange').subscribe((e: any) => {
      this.onEventObserved.next({type: 'fullscreenchange', data: Boolean((<any>document).fullscreen || (<any>document).fullscreenElement)});
    });
    this.html5PlayerEventsSubscription.add(fullscreenchangeEventSub);

    const webkitfullscreenchangeEventSub = fromEvent(document, 'webkitfullscreenchange').subscribe((e: any) => {
      this.onEventObserved.next({type: 'fullscreenchange', data: Boolean((<any>document).webkitIsFullScreen)});
    });
    this.html5PlayerEventsSubscription.add(webkitfullscreenchangeEventSub);

    const mozfullscreenchangeEventSub = fromEvent(document, 'mozfullscreenchange').subscribe((e: any) => {
      this.onEventObserved.next({type: 'fullscreenchange', data: Boolean((<any>document).mozFullScreen)});
    });
    this.html5PlayerEventsSubscription.add(mozfullscreenchangeEventSub);

    const msfullscreenchangeEventSub = fromEvent(document, 'msfullscreenchange').subscribe((e: any) => {
      this.onEventObserved.next({type: 'fullscreenchange', data: Boolean((<any>document).msFullscreenElement)});
    });
    this.html5PlayerEventsSubscription.add(msfullscreenchangeEventSub);
  }

  /**
   * 
   * Handle video player events. This is where the state of the controls is updated.
   * 
   */
  private videoPlayerEventHandling() {
    const onEventSub = this.onEvent().subscribe((e) => {
      if(e == null) {
        return;
      }

      const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;

      if(e.type === 'loadedmetadata') {
        // property 'duration' may be invalid at this point
        this.durationSecs = videoPlayer.duration;
        this.seekSliderMaxValue = videoPlayer.duration;
        this.cd.markForCheck();
      }
      else if(e.type === 'timeupdate') {
        this.onTimeUpdate();
      }
      else if(e.type === 'progress') {
        this.onBufferUpdate();
      }
      else if(e.type === 'play' || e.type === 'pause') {     // update the visibility of play/pause buttons
        this.isPaused = e.type === 'pause';
        this.cd.markForCheck();
      }
      else if(e.type === 'volumechange') {               // update the visibility of volume icons
        const volume: number = e.data;
        this.updateVolumeControls(volume, videoPlayer.muted);
      }
      else if(e.type === 'fullscreenchange') {           // update the visibility of fullscreen icons
        this.onFullScreenChange(e.data);
      }
      else if(e.type === 'ended') {
        this.onVideoEnded.next();
      }

      // console.log('SimplePlayerComponent , onEvent()', e);
    });

    this.onEventSubscription.add(onEventSub);
  }



  private updateVolumeControls(volume: number, muted: boolean) {
    if(muted || volume === 0) {
      this.isVolumeOff = true;
      this.isVolumeDown = this.isVolumeUp = false;
    }
    else if(volume > 0 && volume <= 0.5) {
      this.isVolumeDown = true;
      this.isVolumeUp = this.isVolumeOff = false;
    }
    else {
      this.isVolumeUp = true;
      this.isVolumeOff = this.isVolumeDown = false;
    }

    this.volumeSliderValue = muted ? 0 : volume;

    this.cd.markForCheck();
  }

  private isFullscreenEnabled(): boolean {
    // code from :   https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player

    return Boolean(document.fullscreenEnabled ||
              (<any>document).mozFullScreenEnabled ||
              (<any>document).msFullscreenEnabled ||
              (<any>document).webkitSupportsFullscreen ||
              (<any>document).webkitFullscreenEnabled ||
              (<any>document).createElement('video').webkitRequestFullScreen);
  }

  private isFullScreen(): boolean {
    // code from :   https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player

    return Boolean((<any>document).fullscreen ||
              (<any>document).webkitIsFullScreen ||
              (<any>document).mozFullScreen ||
              (<any>document).msFullscreenElement ||
              (<any>document).fullscreenElement);
  }

  private onFullScreenChange(isFullscreen: boolean) {
    this.isFullScreenActive = isFullscreen;
    this.cd.markForCheck();
  }

  private onTimeUpdate() {
    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;

    this.elapsedTimeSecs = Math.round(videoPlayer.currentTime);
    this.seekSliderValue = videoPlayer.currentTime;

    this.cd.markForCheck();
  }

  private onBufferUpdate() {
    // const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;

    // // for(let i=0 ; i<videoPlayer.buffered.length ; i++) {
    // //   console.log('buffered  -----', i, videoPlayer.buffered.start(i), videoPlayer.buffered.end(i));
    // // }

    // // get the last buffered TimeRange
    // if(videoPlayer.buffered.length >= 1) {
    //   const bufferStart = 0;
    //   const bufferEnd = videoPlayer.buffered.end(videoPlayer.buffered.length-1);
    //   console.log('buffered :   ', videoPlayer.buffered, bufferStart, bufferEnd);
      


    //   //
    //   // TODO :   - Be able to set the slider's middle section value, for buffer progress.
    //   //


    //   // console.log(videoPlayer.buffered.start(videoPlayer.buffered.length-1), videoPlayer.buffered.end(videoPlayer.buffered.length-1));

    // }

  }



  public onEvent(): Observable<{type: string; data: any}> {
    return this.onEventObservable;
  }

  public play(src: string = null, type: string = null): void {
    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;

    if(src != null && type != null) {            // play new video
      videoPlayer.pause();

      this.videoSrc = src;
      this.videoType = type;
      this.cd.detectChanges();

      videoPlayer.load();
      videoPlayer.play();
    }
    else if(src == null && type == null) {       // play loaded video
      videoPlayer.play();
    }
    else {
      console.error('Invalid arguments in  SimplePlayerComponent.play() : ', '\n', 'src :   '+src, '\n', 'type :   '+type);
    }
  }

  public pause() {
    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;
    videoPlayer.pause();
  }

  public togglePlay() {
    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;

    if(!this.isPlaying()) {
      this.play();
    }
    else {
      this.pause();
    }
  }

  public toggleFullScreen() {
    // code from :   https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player

    if(this.isFullScreen()) {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      }
      else if((<any>document).mozCancelFullScreen) {
        (<any>document).mozCancelFullScreen();
      }
      else if((<any>document).webkitCancelFullScreen) {
        (<any>document).webkitCancelFullScreen();
      }
      else if((<any>document).msExitFullscreen) {
        (<any>document).msExitFullscreen();
      }
    }
    else {
      const simplePlayerContainerEl = this.simplePlayerContainer.nativeElement;

      if(simplePlayerContainerEl.requestFullscreen) {
        simplePlayerContainerEl.requestFullscreen();
      }
      else if((<any>simplePlayerContainerEl).mozRequestFullScreen) {
        (<any>simplePlayerContainerEl).mozRequestFullScreen();
      }
      else if((<any>simplePlayerContainerEl).webkitRequestFullScreen) {
        (<any>simplePlayerContainerEl).webkitRequestFullScreen();
      }
      else if((<any>simplePlayerContainerEl).msRequestFullscreen) {
        (<any>simplePlayerContainerEl).msRequestFullscreen();
      }
    }
  }

  public isPlaying(): boolean {
    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;
    return !(videoPlayer.paused || videoPlayer.ended);
  }
  


  public videoPlayerClicked() {
    this.togglePlay();
  }

  public playPauseButtonClicked() {
    this.togglePlay();
  }

  public volumeButtonClicked() {
    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;

    if(!videoPlayer.muted && videoPlayer.volume === 0) {
      videoPlayer.volume = 0.5;
      this.volumeSliderValue = videoPlayer.volume;
    }
    else {
      videoPlayer.muted = !videoPlayer.muted;
    }
  }

  public onVolumeSliderValueChange(e: {value: number, changedProgrammatically: boolean}) {
    const {value, changedProgrammatically} = e;

    // if the slider's values has been changed programmatically, do not continue
    if(changedProgrammatically) {
      return;
    }

    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;

    if(value > 0 && videoPlayer.muted) {
      videoPlayer.muted = false;
    }

    videoPlayer.volume = value;
  }

  public fullscreenButtonClicked() {
    this.toggleFullScreen();
  }

  public onSeekSliderValueChange(e: {value: number, changedProgrammatically: boolean}) {
    const {value, changedProgrammatically} = e;

    // if the slider's values has been changed programmatically, do not continue
    if(changedProgrammatically) {
      return;
    }

    const videoPlayer: HTMLVideoElement = this.videoPlayer.nativeElement;

    videoPlayer.currentTime = value;
    this.elapsedTimeSecs = videoPlayer.currentTime;
  }

  public onSeekSliderDragStart() {
    if(this.isPlaying()) {
      this.pause();
      this.playOnDragEnd = true;
    }
  }

  public onSeekSliderDragEnd() {
    if(this.playOnDragEnd) {
      this.playOnDragEnd = false;
      this.play();
    }
  }

  public onSeekSliderMouseOver(e: {value: number; x: number}) {
    const {value, x} = e;
    const seekSliderTooltipRect = this.seekSliderTooltip.nativeElement.getBoundingClientRect();
    const tooltipPosition = x - seekSliderTooltipRect.width/2;

    this.seekSliderTooltipValue = value;
    this.seekSliderTooltip.nativeElement.style.left = `${tooltipPosition}px`;
    this.cd.markForCheck();
  }

}