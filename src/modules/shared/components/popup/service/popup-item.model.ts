import { ElementRef } from "@angular/core";





export interface PopupItem {
  id: string;
  template: ElementRef;
  context: any;
  position: {x: number; y: number};
  transform: string;
  onShown?: () => void;    // will be called when the PopupItem has been rendered

  // this will be set by PopupContainerComponent
  _nativeElement?: any;
};



export interface Popup {
  show: () => void; 
  hide: () => boolean; 
  setPosition: (x: number, y: number) => void; 
  getPosition: () => {x: number; y: number}; 
  getNativeElement: () => any; 
}