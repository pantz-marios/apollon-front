import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AddQueueItem } from './player.model';





@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  
  constructor(private http: HttpClient) {}



  public getQueueItems(): Observable<any> {
    const playerServiceUrl = `${environment.API_URL}/queue`;
    return this.http.get(playerServiceUrl);
  }

  public addQueueItem(addQueueItem: AddQueueItem, afterId: number = null, addFirst: boolean = false): Observable<any> {
    let params = null;
    if(addFirst) {
      params = 'addFirst';
    }
    else if(afterId != null) {
      params = `afterId=${afterId}`
    }

    const playerServiceUrl = params == null ? `${environment.API_URL}/queue` : `${environment.API_URL}/queue?${params}`;
    return this.http.post(playerServiceUrl, addQueueItem);
  }

  public removeQueueItem(queueItemId: number): Observable<any> {
    const playerServiceUrl = `${environment.API_URL}/queue/${queueItemId}`;
    return this.http.delete(playerServiceUrl);
  }

  public clearQueue(): Observable<any> {
    const playerServiceUrl = `${environment.API_URL}/queue/`;
    return this.http.delete(playerServiceUrl);
  }

}