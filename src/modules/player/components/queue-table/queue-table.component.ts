import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlayerState } from '@modules/player/state/player.state';
import { SimpleTableColumn, SimpleTableColumnType } from '@modules/shared/components/simple-table/simple-table.model';
import { QueueItem } from '@modules/player/service/player.model';





@Component({
  selector: 'queue-table',
  templateUrl: './queue-table.component.html',
  styleUrls: ['./queue-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueueTableComponent implements OnInit {
  public tableItems = this.playerState.getQueueItemsObservable();
  public tableColumns: SimpleTableColumn[] = null;

  @ViewChild('thumbnailCellTemplate', {static: true}) thumbnailCellTemplate: ElementRef;
  @ViewChild('titleArtistCellTemplate', {static: true}) titleArtistCellTemplate: ElementRef;
  @ViewChild('actionsCellTemplate', {static: true}) actionsCellTemplate: ElementRef;
  
  

  constructor(
    private playerState: PlayerState
  ) {}



  public ngOnInit() {
    this.tableColumns = [
      // { property: 'id', header: 'ID', className: 'col-id' },
      { property: 'thumbnailUrl', header: 'Thumbnail', type: SimpleTableColumnType.Custom, customCellTemplate: this.thumbnailCellTemplate, className: 'col-thumbnail' },
      { property: 'title', header: 'Title - Artist', type: SimpleTableColumnType.Custom, customCellTemplate: this.titleArtistCellTemplate, className: 'col-title-artist' },
      { property: 'title', header: 'Actions', type: SimpleTableColumnType.Custom, customCellTemplate: this.actionsCellTemplate, className: 'col-actions' }
    ];
  }

  public ngOnDestroy() {

  }



  public onPlayQueueItem(queueItem: QueueItem) {
    const queueItemIndex = this.playerState.getQueueItems().findIndex((qi) => qi.id === queueItem.id);
    this.playerState.play(queueItemIndex);
  }

  public onRemoveQueueItem(queueItem: QueueItem) {

    this.playerState.removeFromQueue(queueItem.id).then(
      (result) => {
        console.log('Queue Item has been removed from the queue.', result);
      },
      (error) => {
        console.log('Error! Queue Item has NOT been removed from the queue.', error);
      }
    );

  }
  
}