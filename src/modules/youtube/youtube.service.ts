import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { YoutubeVideo, YoutubeVideoExtraInfo } from './youtube.model';





@Injectable({
  providedIn: 'root'
})
export class YoutubeService {


  
  constructor(private http: HttpClient) {}



  public search(query: string, limit: number): Observable<YoutubeVideo[]> {
    const searchServiceUrl = `${environment.API_URL}/youtube/search/${query}?limit=${limit}`;
    return this.http.get<YoutubeVideo[]>(searchServiceUrl);
  }

  public getVideoInfo(url: string): Observable<YoutubeVideoExtraInfo> {
    const videoInfoServiceUrl = `${environment.API_URL}/youtube/video-info?url=${url}`;
    return this.http.get<YoutubeVideoExtraInfo>(videoInfoServiceUrl);
  }

}