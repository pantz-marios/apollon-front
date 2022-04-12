import { Injectable } from '@angular/core';
import { PopupContainerComponent } from '../components/popup-container/popup-container.component';
import { PopupItem } from '../service/popup-item.model';





@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private popupContainerComponent: PopupContainerComponent = null;



  constructor() {}



  public setPopupContainer(popupContainerComponent: PopupContainerComponent) {
    this.popupContainerComponent = popupContainerComponent;
  }

  public setItems(items: PopupItem[]) {
    this.popupContainerComponent.setItems(items);
  }

  public getItems(): PopupItem[] {
    return this.popupContainerComponent.getItems();
  }

  public refresh(): void {
    this.popupContainerComponent.refresh();
  }

}