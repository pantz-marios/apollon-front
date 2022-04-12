import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PlayerService } from '@modules/player/service/player.service';
import { YoutubeService } from '@modules/youtube/youtube.service';
import { SimplePlayerComponent } from '@modules/shared/components/simple-player/simple-player.component';
import { AddQueueItem, QueueItem } from '@modules/player/service/player.model';
import { YoutubeVideo } from '@modules/youtube/youtube.model';
import { VideoSourceType } from '@modules/video/video.model';





@Injectable({
  providedIn: 'root'
})
export class PlayerState {
  private initialized = false;
  private loaded: boolean = false;

  private player: SimplePlayerComponent = null;

  private queueItemsObserved: BehaviorSubject<QueueItem[]> = new BehaviorSubject(null);
  private queueItemsObservable: Observable<QueueItem[]> = this.queueItemsObserved.asObservable();

  private playingItemIndex: number = null;

  private onVideoEndedSubscription: Subscription = null;

  private thumbnailUrlObserved: BehaviorSubject<string> = new BehaviorSubject(null);
  public thumbnailUrl$: Observable<string> = this.thumbnailUrlObserved.asObservable();
  private videoTitleObserved: BehaviorSubject<string> = new BehaviorSubject(null);
  public videoTitle$: Observable<string> = this.videoTitleObserved.asObservable();
  private videoArtistObserved: BehaviorSubject<string> = new BehaviorSubject(null);
  public videoArtist$: Observable<string> = this.videoArtistObserved.asObservable();


  
  constructor(
    private playerService: PlayerService,
    private youtubeService: YoutubeService
  ) {}



  public init(player: SimplePlayerComponent): void {
    if(this.initialized) {
      return;
    }
  
    this.initialized = true;
    this.player = player;
    
    
    this.onVideoEndedSubscription = this.player.onVideoEnded$.subscribe(() => this.onVideoEnded());

    // get queue items from database
    this.playerService.getQueueItems().subscribe((queueItems: QueueItem[]) => {
      if(queueItems == null) {
        return;
      }

      queueItems.forEach((qi) => qi.isLoading = new BehaviorSubject(false));

      this.loaded = true;
      this.queueItemsObserved.next(queueItems);
    });
  }

  public dispose() {
    this.initialized = false;
    this.loaded = false;

    this.player = null;

    this.onVideoEndedSubscription.unsubscribe();

    this.queueItemsObserved = new BehaviorSubject(null);
    this.queueItemsObservable = this.queueItemsObserved.asObservable();

    this.playingItemIndex = null;

    this.thumbnailUrlObserved = new BehaviorSubject(null);
    this.thumbnailUrl$ = this.thumbnailUrlObserved.asObservable();
    this.videoTitleObserved = new BehaviorSubject(null);
    this.videoTitle$ = this.videoTitleObserved.asObservable();
    this.videoArtistObserved = new BehaviorSubject(null);
    this.videoArtist$ = this.videoArtistObserved.asObservable();
  }



  public addToQueueYoutubeVideo(youtubeId: string, afterId: number = null, addFirst: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
  
      const addQueuetItemData: AddQueueItem = {
        type: VideoSourceType.YOUTUBE,
        url: "https://www.youtube.com/watch?v=" + youtubeId
      };
  
  
      // call backend to add new queue item in the database
      this.playerService.addQueueItem(addQueuetItemData, afterId, addFirst).subscribe(
        (res) => {
          const newQueueItem: QueueItem = res;
          const queueItems = this.getQueueItems();

          // add the new queue item at the correct queue position
          let newQueueItems = [...queueItems];
          let queueIndex = -1;
          if(afterId == null && !addFirst) {                   // add new queue item at the end of the queue
            newQueueItems = [...queueItems, newQueueItem];
            queueIndex = newQueueItems.length - 1;
          }
          else if(afterId != null) {                           // add new queue item after the queue item with ID = 'afterId'
            const afterIndex = queueItems.findIndex((qi) => qi.id === afterId);
            queueIndex = afterIndex + 1;

            if(afterIndex >= 0) {
              newQueueItems.splice(queueIndex, 0, newQueueItem);
            }
          }
          else if(addFirst) {                                  // add new queue item at the start of the queue
            newQueueItems = [newQueueItem, ...queueItems];
            queueIndex = 0;
          }
          else {
            console.error('Invalid parameters', afterId, addFirst);
          }

          newQueueItem.isLoading = new BehaviorSubject(false);

          this.queueItemsObserved.next(newQueueItems);
  
          res.queueIndex = queueIndex;
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public removeFromQueue(queueItemId: number): Promise<any> {
    return new Promise((resolve, reject) => {
  
      // call backend to remove queue item from the database
      this.playerService.removeQueueItem(queueItemId).subscribe(
        (res) => {
          const queueItems = this.getQueueItems();
          const queueItemIndex = queueItems.findIndex((qi) => qi.id === queueItemId);

          if(queueItemIndex < 0) {
            return;
          }

          const removedQueueItem = queueItems.filter((qi) => qi.id === queueItemId)[0];
          queueItems.splice(queueItemIndex, 1);
          const newQueueItems = [...queueItems];

          this.queueItemsObserved.next(newQueueItems);
  
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public clearQueue(): Promise<any> {
    return new Promise((resolve, reject) => {
  
      // call backend to remove queue item from the database
      this.playerService.clearQueue().subscribe(
        (res) => {
          const queueItems = this.getQueueItems();
          const newQueueItems = [];
      
          this.queueItemsObserved.next(newQueueItems);
  
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public isLoaded(): boolean {
    return this.loaded;
  }

  public getQueueItemsObservable(): Observable<QueueItem[]> {
    return this.queueItemsObservable;
  }

  public getQueueItems(): QueueItem[] {
    return this.queueItemsObserved.getValue();
  }



  /**
   * 
   * Play the queue item at the given index.
   * If the given index is null, the first queue item will be played.
   * 
   */
  public play(index: number = null) {
    if(this.getQueueItems() == null || this.getQueueItems().length === 0) {
      return;
    }

    if(index == null) {
      index = 0;
    }

    if(index < 0 || index >= this.getQueueItems().length) {
      return;
    }

    const prevQueueItem: QueueItem = this.playingItemIndex != null ? this.getQueueItems()[this.playingItemIndex] : null;
    
    this.playingItemIndex = index;

    const queueItem: QueueItem = this.getQueueItems()[this.playingItemIndex];

    if(queueItem.isLoading.getValue()) {
      return;
    }

    if(prevQueueItem) {
      prevQueueItem.isLoading.next(false);
      prevQueueItem.rowSelected = false;
    }

    queueItem.isLoading.next(true);
    queueItem.rowSelected = true;

    if(queueItem.sourceType === VideoSourceType.YOUTUBE) {
      const youtubeVideoUrl = 'https://www.youtube.com/watch?v=' + queueItem.externalId;

      this.thumbnailUrlObserved.next(queueItem.thumbnailUrl);
      this.videoTitleObserved.next(queueItem.title);
      this.videoArtistObserved.next(queueItem.artist);

      // get youtube video info from the backend
      this.youtubeService.getVideoInfo(youtubeVideoUrl).subscribe((videoInfo) => {
        const videoFormats = videoInfo.formats;
        const videoTrueUrl = videoFormats[0].url;

        // play youtube video
        this.player.play(videoTrueUrl, 'video/mp4');

        queueItem.isLoading.next(false);
      });

    }

  }

  /**
   * 
   * Pause player.
   * 
   */
  public pause() {
    this.player.pause();
  }

  /**
   * 
   * Play the next item in the queue.
   * 
   */
  public playNext() {
    if(this.getQueueItems() == null || this.getQueueItems().length === 0 || this.playingItemIndex == null) {
      return;
    }

    if(this.playingItemIndex + 1 > this.getQueueItems().length - 1) {
      return;
    }

    const nextQueueItemIndex = this.playingItemIndex + 1;

    this.play(nextQueueItemIndex);
  }

  /**
   * 
   * Play the previous item in the queue.
   * 
   */
  public playPrevious() {
    if(this.getQueueItems() == null || this.getQueueItems().length === 0 || this.playingItemIndex == null) {
      return;
    }

    if(this.playingItemIndex - 1 < 0) {
      return;
    }

    const previousQueueItemIndex = this.playingItemIndex - 1;

    this.play(previousQueueItemIndex);
  }



  public playYoutubeVideo(video: YoutubeVideo) {
    // add video to queue after the currently playing item
    this.addToQueueNextYoutubeVideo(video).then(
      (result) => {
        console.log('Queue Item has been added to queue.', result.queueIndex, result);

        // play item from the queue
        this.play(result.queueIndex);
      },
      (error) => {
        console.log('Error! Queue Item has NOT been added to queue.', error);
      }
    );
  }

  public playNextYoutubeVideo(video: YoutubeVideo) {
    // add video to queue after the currently playing item
    this.addToQueueNextYoutubeVideo(video).then(
      (result) => {
        console.log('Queue Item has been added to queue.', result.queueIndex, result);
      },
      (error) => {
        console.log('Error! Queue Item has NOT been added to queue.', error);
      }
    );
  }

  private addToQueueNextYoutubeVideo(video: YoutubeVideo): Promise<any> {
    return new Promise((resolve, reject) => {

      if(video == null) {
        return;
      }
  
      // the video should be added after the currently playing item or first in the queue if no queue item is playing
      let afterId = null;
      let addFirst = false;
      if(this.getQueueItems() == null || this.getQueueItems().length === 0 || this.playingItemIndex == null) {
        addFirst = true;
      }
      else {
        afterId = this.getQueueItems()[this.playingItemIndex].id;
      }
  
      // add video to queue after the currently playing item
      this.addToQueueYoutubeVideo(video.id, afterId, addFirst).then(
        (result) => resolve(result),
        (error) => reject(error)
      );
    });
  }



  private onVideoEnded() {
    this.playNext();
  }

}