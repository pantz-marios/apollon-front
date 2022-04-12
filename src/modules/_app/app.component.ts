import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventBusService, AppEvent } from '@modules/core/event-bus.service';
import { SearchState } from '@modules/search/state/search.state';
import { ThemeService } from '@modules/theme/service/theme.service';
import { Theme } from '@modules/theme/service/theme.model';
import { SimplePlayerComponent } from '@modules/shared/components/simple-player/simple-player.component';
import { PlayerState } from '@modules/player/state/player.state';
import { PlayerPositionEvent } from '@modules/player/state/player.events';





declare const initSidebar: any;


interface PlayerPosition {
  transform: string;
  bottom: string;
  width: string;
  height: string;
  animation: string;
}





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {
  public hightlightedMenuItem: BehaviorSubject<string> = new BehaviorSubject('');
  public lastSearchQuery: string;
  public activeThemeName: string = null;
  private themeServiceSubscription: Subscription = null;
  private searchQuerySubscription: Subscription = null;
  private eventBusOnAnySubscription: Subscription = null;
  private eventBusServiceSubscriptions: Subscription = new Subscription();
  private playerEventsSubscription: Subscription = new Subscription();

  private readonly DEFAULT_THEME = 'light';


  private readonly PLAYER_CONTAINER_LEFT_STYLE: PlayerPosition = {
    transform: 'translate3d(-245px, 0px, 0)',
    bottom: '5px',
    width: '240px',
    height: '135px',
    animation: 'player-container-left-animation 350ms ease-in'
  };

  public playerContainerStyle$ = new BehaviorSubject<PlayerPosition>(this.PLAYER_CONTAINER_LEFT_STYLE);
  
  @ViewChild('player', {static: true}) player: SimplePlayerComponent;



  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private themeService: ThemeService,
    private eventBusService: EventBusService,
    public playerState: PlayerState,
    private searchState: SearchState
  ) {}



  public ngOnInit() {

    //  FOR DEBUGGING
    this.eventBusOnAnySubscription = this.eventBusService.onAny().subscribe((e: AppEvent) => {
      if(e.name === 'Player.PlayPosition.PositionChanged') {
        return;
      }
      
      console.log('--------------   EventBusService.onAny()   --------------   ', e);
    });
    

    // initialize PlayerState service and pass the SimplePlayerComponent instance reference
    this.playerState.init(this.player);

    // initialize SearchState sevice
    this.searchState.init();


    
    // subscribe to  'PlayerPositionEvent.PositionChanged'  event to update the player position
    let eventBusSub = this.eventBusService.on(PlayerPositionEvent.PositionChanged).subscribe((e: AppEvent) => {
      this.playerContainerStyle$.next({
        transform: e.data.transform,
        width: e.data.width,
        height: e.data.height,
        bottom: e.data.bottom,
        animation: e.data.animation
      });
      this.cd.detectChanges();
    });
    this.eventBusOnAnySubscription.add(eventBusSub);


    // if the page refreshes, highlight the correct left menu item
    this.highlightActiveMenuItem(this.router.url);

    // update page state dependent on the url
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.highlightActiveMenuItem(event.urlAfterRedirects);

      if(event.urlAfterRedirects !== '/playing-now') {
        this.eventBusService.emit(PlayerPositionEvent.PositionChanged, this.PLAYER_CONTAINER_LEFT_STYLE);
      }
    });


    // when the search query changes(from the query params), update variable 'lastSearchQuery' for the correct link in left menu
    this.searchQuerySubscription = this.searchState.getSearchQueryObservable().subscribe((searchQuery) => this.lastSearchQuery = searchQuery);


    // subsribe to theme changes, this is needed to toggle between themes and set the correct theme icon
    this.themeServiceSubscription = this.themeService.getActiveThemeObservable().subscribe((newTheme: Theme) => {
      if(newTheme == null) {
        return;
      }

      this.activeThemeName = newTheme.name;
    });


    // set default theme
    this.themeService.setTheme(this.DEFAULT_THEME);
  }

  public ngAfterViewInit() {
    initSidebar();
  }

  public ngOnDestroy() {
    if(this.themeServiceSubscription != null) {
      this.themeServiceSubscription.unsubscribe();
    }

    if(this.searchQuerySubscription != null) {
      this.searchQuerySubscription.unsubscribe();
    }

    // unsubscribe from 'EventBusService' events, subscribed for debugging
    if(this.eventBusOnAnySubscription != null) {
      this.eventBusOnAnySubscription.unsubscribe();
    }

    if(this.playerEventsSubscription != null) {
      this.playerEventsSubscription.unsubscribe();
    }

    this.eventBusServiceSubscriptions.unsubscribe();

    this.playerState.dispose();

    this.searchState.dispose();
  }



  private highlightActiveMenuItem(currentUrlPath: string) {
    this.hightlightedMenuItem.next(currentUrlPath);
  }

  public onSearch(searchQuery) {
    this.lastSearchQuery = searchQuery;

    this.router.navigate(['/search'], {
      queryParams: {q: searchQuery},
      replaceUrl: true
    });
  }

  public toggleTheme() {
    const newThemeName: string = this.activeThemeName == null || this.activeThemeName === 'light' ? 'dark' : 'light'; 
    this.themeService.setTheme(newThemeName);
  }



  public playPreviousButtonClicked() {
    this.playerState.playPrevious();
  }

  public playNextButtonClicked() {
    this.playerState.playNext();
  }

}