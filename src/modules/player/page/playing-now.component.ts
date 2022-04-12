import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventBusService } from '@modules/core/event-bus.service';
import { PlayerState } from '@modules/player/state/player.state';
import { PlayerPositionEvent } from '@modules/player/state/player.events';





@Component({
  selector: 'playing-now',
  templateUrl: './playing-now.component.html',
  styleUrls: ['./playing-now.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayingNowComponent implements OnInit {

  private resizeObserver: ResizeObserver = null;

  @ViewChild('playerPlaceholderContainer', {static: true}) playerPlaceholderContainer: ElementRef<HTMLDivElement>;
  @ViewChild('playerPlaceholder', {static: true}) playerPlaceholder: ElementRef<HTMLDivElement>;
  

  constructor(
    private eventBusService: EventBusService,
    private playerState: PlayerState
  ){}



  public ngOnInit() {

    // listen for the resize of the 'playerPlaceholderContainer' element
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.onPlayerRegionResized(entry.contentRect.width, entry.contentRect.height);
      });
    });
    this.resizeObserver.observe(this.playerPlaceholderContainer.nativeElement);

  }

  public ngOnDestroy() {
    this.resizeObserver.unobserve(this.playerPlaceholderContainer.nativeElement);
  }



  private onPlayerRegionResized(width, height) {
    let playerPlaceholderWidth = width;
    let playerPlaceholderHeight = playerPlaceholderWidth * (9 / 16);

    if(playerPlaceholderHeight > height) {
      playerPlaceholderHeight = height;
      playerPlaceholderWidth = playerPlaceholderHeight * (16 / 9);
    }

    const marginTop = 30;
    const marginLeft = 30;
    const playerPlaceholderX = (width - playerPlaceholderWidth) / 2;
    const playerPlaceholderY = (height - playerPlaceholderHeight) / 2;

    this.playerPlaceholder.nativeElement.style.transform = `translate3d(${playerPlaceholderX}px, ${playerPlaceholderY}px, 0px)`;
    this.playerPlaceholder.nativeElement.style.width = `${playerPlaceholderWidth}px`;
    this.playerPlaceholder.nativeElement.style.height = `${playerPlaceholderHeight}px`;

    this.eventBusService.emit(PlayerPositionEvent.PositionChanged, {
      transform: `translate3d(${playerPlaceholderX + marginTop}px, ${playerPlaceholderY + marginLeft}px, 0px)`,
      width: `${playerPlaceholderWidth}px`,
      height: `${playerPlaceholderHeight}px`,
      bottom: 'auto',
      animation: 'player-container-center-animation 350ms ease-in'
    });
  }



  public onClearQueue() {

    this.playerState.clearQueue().then(
      (result) => {
        console.log('Queue has been cleared.', result);
      },
      (error) => {
        console.log('Error! Queue has NOT been cleared.', error);
      }
    );

  }

}