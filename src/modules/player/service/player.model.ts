import { BehaviorSubject } from "rxjs";
import { SimpleTableRowSettings } from "@modules/shared/components/simple-table/simple-table.model";
import { VideoSourceType } from "@modules/video/video.model";





export interface QueueItem extends SimpleTableRowSettings {
  id?: number;
  title: string;
  artist: string;
  runtime: number;   // runtime in secs
  thumbnailUrl?: string;
  url?: string;

  sourceType: VideoSourceType;
  externalId: string;
  isLoading?: BehaviorSubject<boolean>;
}



export interface AddQueueItem {
  type: VideoSourceType;
  url: string;
}