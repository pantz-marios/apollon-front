import { Pipe, PipeTransform } from '@angular/core';





@Pipe({
    name: 'secsToHmsPipe',
})
export class SecsToHmsPipe implements PipeTransform {
  transform(secs: number, args?: any): any {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor(secs % 3600 / 60);
    const seconds = Math.floor(secs % 3600 % 60);
  
    const secondsStr = seconds >= 10 ? seconds : '0'+seconds;
    const minutesSecondsStr = minutes > 0 ? `${minutes}:${secondsStr}` : `00:${secondsStr}`;
    const hoursMinutesSecondsStr = hours > 0 ? `${hours}:${minutes >= 10 || minutes === 0 ? minutesSecondsStr : '0'+minutesSecondsStr}` : minutesSecondsStr;
  
    return hoursMinutesSecondsStr;
  }
}