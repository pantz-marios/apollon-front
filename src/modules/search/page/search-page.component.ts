import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { PlayerState } from '@modules/player/state/player.state';
import { PopupMenuItem } from '@modules/shared/components/popup/components/popup-menu/popup-menu.model';
import { SearchState } from '@modules/search/state/search.state';
import { YoutubeVideo } from '@modules/youtube/youtube.model';





@Component({
  selector: 'search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements OnInit {
  private queryParamsSubscription: Subscription = null;
  public searchQuery: string = null;
  public showPageLoader = false;
  public items: any[];

  // public itemWidth: string = '240px';
  // public itemHeight: string = '135px';
  // public horizontalSpacing: string = '30px';
  // public verticalSpacing: string = '100px';

  public tileContextMenuItems: PopupMenuItem[] = [
    {
      text: 'Play',
      iconSrc: '/assets/play.svg',
      onClick: (item) => this.onVideoPlayClicked(item)
    },
    {
      text: 'Play next',
      iconSrc: '/assets/play-next-icon.svg',
      onClick: (item) => this.onVideoPlayNextClicked(item)
    },
    {
      text: 'Add to queue',
      iconSrc: '/assets/add-to-queue-icon.svg',
      onClick: (item) => this.onVideoAddToQueueClicked(item)
    },
    {
      text: 'Add to playlist',
      iconSrc: '/assets/add-to-playlist-icon.svg',
      onClick: (item) => this.onVideoAddToPlaylistClicked(item)
    }    
  ];



  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private playerState: PlayerState,
    private searchState: SearchState
  ) {}



  public ngOnInit() {

    // subscribe to ActivatedRoute query params
    this.queryParamsSubscription = this.route.queryParams.subscribe((queryParams: any) => this.onQueryParamsChanged(queryParams));


    //
    // TODO :   - Should be passed to 'TilePaneComponent' and set from there. Also should be set only for
    //            that 'TilePaneComponent' instance, not for all 'TilePaneComponent' instances.
    //
    document.documentElement.style.setProperty('--item-width', '240px');
    document.documentElement.style.setProperty('--item-height', '135px');
    document.documentElement.style.setProperty('--horizontal-spacing', '30px');
    document.documentElement.style.setProperty('--vertical-spacing', '200px');
  }

  public ngOnDestroy() {
    if(this.queryParamsSubscription != null) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  
  
  private onQueryParamsChanged(queryParams: any) {
    const searchQuery = queryParams['q'];
    const toSearch = searchQuery != null && searchQuery !== this.searchState.getSearchQuery();
    this.searchQuery = searchQuery;

    console.log('############     '+searchQuery+'       ,      toSearch : '+toSearch);

    // load search results
    if(toSearch) {                          // search query has changed, load search results from the server 
      this.search(searchQuery);
    }
    else if(searchQuery != null) {          // search query has not changed, load search results from 'SearchState'
      this.searchQuery = searchQuery;
      this.items = this.searchState.getItems();
    }
  }

  private search(searchQuery: string) {
    this.showPageLoader = true;

    this.cd.markForCheck();

    this.searchState.search(searchQuery).then(
      (result) => {
        console.log('Search completed.', result);

        this.items = result;
        this.showPageLoader = false;
        this.cd.markForCheck();
      },
      (error) => {
        console.log('Error! Failed to search.', error);
      }
    );
  }



  public onVideoPlayClicked(video: YoutubeVideo) {
    this.playerState.playYoutubeVideo(video);
  }

  public onVideoPlayNextClicked(video: YoutubeVideo) {
    this.playerState.playNextYoutubeVideo(video);
  }

  public onVideoAddToQueueClicked(video: YoutubeVideo) {

    this.playerState.addToQueueYoutubeVideo(video.id).then(
      (result) => {
        console.log('Queue Item has been added to queue.', result);
      },
      (error) => {
        console.log('Error! Queue Item has NOT been added to queue.', error);
      }
    );

  }

  public onVideoAddToPlaylistClicked(video: YoutubeVideo) {
    console.log('add to playlist');
  }


  
  public onImageLoaded(el, imgPlaceholderEl: HTMLSpanElement) {
    // console.log('+++++++++++     SearchPageComponent         onImageLoaded', el);
    // console.log(imgPlaceholderEl);

    if(imgPlaceholderEl != null) {
      imgPlaceholderEl.style.display = 'none';
    }
  }

}