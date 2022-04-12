import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { YoutubeService } from '@modules/youtube/youtube.service';





@Injectable({
  providedIn: 'root'
})
export class SearchState {
  private initialized = false;
  private loaded: boolean = false;
  private items: any[] = null;
  private searchQuerySubj: BehaviorSubject<string> = new BehaviorSubject(null);
  private searchQueryObservable: Observable<string> = this.searchQuerySubj.asObservable();

  private readonly SEARCH_LIMIT = 30;



  constructor(
    private youtubeService: YoutubeService
  ) {}



  public init(): void {
    if(this.initialized) {
      return;
    }
  
    this.initialized = true;
  }

  public dispose() {
    this.initialized = false;
    this.loaded = false;

    this.searchQuerySubj = new BehaviorSubject(null);
    this.searchQueryObservable = this.searchQuerySubj.asObservable();
  }



  public isLoaded(): boolean {
    return this.loaded;
  }

  public getItems(): any[] {
    return this.items;
  }

  public getSearchQueryObservable(): Observable<string> {
    return this.searchQueryObservable;
  }

  public getSearchQuery(): string {
    return this.searchQuerySubj.getValue();
  }



  public search(searchQuery: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.searchQuerySubj.next(searchQuery);

      this.youtubeService.search(searchQuery, this.SEARCH_LIMIT).subscribe(
        (res) => {
          let items = res;
  
          items.forEach((item) => item['itemViewsStr'] = Number(item.views).toLocaleString());
          items = items.filter((item) => item.type === 'video');
          
          this.items = items;

          resolve(items);
        },
        (err) => {
          reject(err);
        }
      );
    });

  }

}