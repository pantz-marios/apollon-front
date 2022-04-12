import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PopupService } from '../../service/popup.service';
import { PopupItem } from '../../service/popup-item.model';





@Component({
  selector: 'popup-container',
  templateUrl: './popup-container.component.html',
  styleUrls: ['./popup-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupContainerComponent {
  items: PopupItem[] = [];

 

  constructor(
    private cd: ChangeDetectorRef,
    private popupService: PopupService
  ) {}



  public ngOnInit() {
    this.popupService.setPopupContainer(this);
  }



  public setItems(items: PopupItem[]) {
    this.items = items;
    this.cd.markForCheck();
  }

  public getItems(): PopupItem[] {
    return this.items;
  }

  public refresh(): void {
    this.cd.detectChanges();
  }



  public onElemRefChanged(elemRef, item: PopupItem) {
    item._nativeElement = elemRef.nativeElement.firstChild;

    if(item.onShown != null) {
      item.onShown();
    }
  }

}