import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';





export interface AppEvent {
  name: string;
  data: any;
}



@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject = new Subject<AppEvent>();



  constructor() {}



  public emit(name: string, data: any) {
    this.subject.next({
      name,
      data
    });
  }

  public on(eventName: string): Observable<any> {
    return this.subject.pipe(
      filter((e: AppEvent) => {
        return e.name === eventName;
      })
    );
  }

  public onAny(): Observable<any> {
    return this.subject;
  }

}