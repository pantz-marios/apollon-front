import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as uuid from 'uuid';
import { PopupService } from '../../service/popup.service';
import { PopupMenuItem } from '../../components/popup-menu/popup-menu.model';
import { Popup, PopupItem } from '../../service/popup-item.model';





@Component({
  selector: 'popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupMenuComponent implements Popup {
  private isVisible: boolean = true;
  private position: {x: number; y: number} = {x: 0, y: 0};
  private openPopupItems: PopupItem[] = [];                  // an array of PopupItems managed by this component(per component instance)
  private popupMenuElem: ElementRef;

  @ViewChild('menuTemplate', {static: true}) menuTemplate: ElementRef;

  @Input() public context: any;
  @Input() public items: PopupMenuItem[];
  @Output() onShown = new EventEmitter();



  constructor(
    private popupService: PopupService
  ) {}



  public ngOnInit() {
    if(!this.isVisible) {
      return;
    }

    this.isVisible = true;
    this.init();
  }

  public ngOnDestroy() {
    // get all PopupItems that are NOT managed by this component's instance
    const otherPopupItems = this.popupService.getItems().filter((pi: PopupItem) => 
      this.openPopupItems.findIndex((opi) => pi.id === opi.id) < 0
    );

    // remove all PopupItems managed by this component
    this.popupService.setItems([...otherPopupItems]);
  }



  private init() {
    if(this.items == null && this.position == null) {
      return;
    }

    // create new PopupItem
    const currPopupItem: PopupItem = {
      id: uuid.v4(),
      template: this.menuTemplate,
      context: this.items,
      position: this.position,
      transform: PopupMenuComponent.getTransfromFromPosition(this.position.x, this.position.y)
    };

    this.openPopupItems.push(currPopupItem);

    // set all children PopupMenuItems'  'parentPopupItem' and 'popupItem' properties
    for(const item of this.items) {
      item.parentPopupItem = null;
      item.popupItem = currPopupItem;
    }

    // set new visible PopupItems
    const allPopupItems = this.popupService.getItems();
    const newPopupItems = [...allPopupItems, currPopupItem];
    this.popupService.setItems(newPopupItems);
  }

  private removeAllPopupItems() {
    // get all PopupItems that are NOT managed by this component's instance
    const otherPopupItems = this.popupService.getItems().filter((pi: PopupItem) => 
      this.openPopupItems.findIndex((opi) => pi.id === opi.id) < 0
    );

    // remove all PopupItems managed by this component
    this.popupService.setItems([...otherPopupItems]);

    // no PopupItems are managed from this component's instance
    this.openPopupItems = [];
  }



  public onMenuItemMouseEnter(e: any, popupMenuItem: PopupMenuItem) {
    // find all parent PopupItems for the hovered PopupMenuItem
    let allParentPopupItems: PopupItem[] = [];
    let currPopupMenuItem: PopupMenuItem = popupMenuItem;
    while(currPopupMenuItem) {
      allParentPopupItems.push(currPopupMenuItem.popupItem);
      currPopupMenuItem = currPopupMenuItem.parentPopupItem;
    }
    allParentPopupItems = allParentPopupItems.reverse();   // this is required so that child menus are above parent menus on the z axis

    // get all PopupItems that are NOT managed by this component's instance
    const otherPopupItems = this.popupService.getItems().filter((pi: PopupItem) => 
      this.openPopupItems.findIndex((opi) => pi.id === opi.id) < 0
    );


    // if the hovered PopupMenuItem does not have any items, update PopupItems in order to show
    // only the hovered PopupMenuItem's parent PopupItems
    if(popupMenuItem.items == null || popupMenuItem.items.length === 0) {

      // the new visible PopupItems for this component's instance, should be all parent PopupItems for the hovered PopupMenuItem
      this.openPopupItems = [...allParentPopupItems];

      // set new visible PopupItems
      const newPopupItems = [...otherPopupItems, ...this.openPopupItems];
      this.popupService.setItems(newPopupItems);

      return;
    }
   
    const menuItemRect = e.target.getBoundingClientRect();
    const parentPopupItemRect = popupMenuItem.popupItem._nativeElement.getBoundingClientRect();
    const newPopupItemPosition = {x: parentPopupItemRect.left+parentPopupItemRect.width, y: menuItemRect.top};

    // create new PopupItem
    const currPopupItem: PopupItem = {
      id: uuid.v4(),
      template: this.menuTemplate,
      context: popupMenuItem.items,
      position: newPopupItemPosition,
      transform: PopupMenuComponent.getTransfromFromPosition(newPopupItemPosition.x, newPopupItemPosition.y),
      onShown: () => this.onSubMenuShown(currPopupItem, parentPopupItemRect, menuItemRect)
    };

    // for the hovered PopupMenuItem set 'childPopupItem' property
    popupMenuItem.childPopupItem = currPopupItem;

    // set all hovered PopupMenuItem's children PopupMenuItems'  'parentPopupItem' and 'popupItem' properties
    for(const item of popupMenuItem.items) {
      item.parentPopupItem = popupMenuItem;
      item.popupItem = currPopupItem;
    }

    // the new visible PopupItems for this component's instance, should be all parent PopupItems 
    // for the hovered PopupMenuItem and the new PopupItem
    this.openPopupItems = [...allParentPopupItems, currPopupItem];

    // set new visible PopupItems
    const newPopupItems = [...otherPopupItems, ...this.openPopupItems];
    this.popupService.setItems(newPopupItems);
  }

  public onMenuItemClick(item: PopupMenuItem) {
    if(item.onClick == null) {
      return;
    }

    item.onClick(this.context);
    this.hide();
  }

  public static getTransfromFromPosition(x: number, y: number): string {
    return `translate3d(${x}px, ${y}px, 0px)`;
  }

  public onElemRefChanged(elemRef) {
    this.popupMenuElem = elemRef;
    this.onShown.emit(elemRef);
  }

  private onSubMenuShown(popupItem: PopupItem, parentPopupItemRect: any, menuItemRect: any) {
    const popupItemRect = popupItem._nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const viewportOverflowedHorizontally = viewportWidth < popupItemRect.left + popupItemRect.width;
    const viewportOverflowedVertically = viewportHeight < popupItemRect.top + popupItemRect.height;
    
    if(!viewportOverflowedHorizontally && !viewportOverflowedVertically) {
      return;
    }

    const newPosition = {
      x: viewportOverflowedHorizontally ? parentPopupItemRect.left - popupItemRect.width : popupItem.position.x,
      y: viewportOverflowedVertically ? menuItemRect.top + menuItemRect.height - popupItemRect.height : popupItem.position.y
    };

    // update PopupItem's position
    popupItem.position = newPosition;
    popupItem.transform = PopupMenuComponent.getTransfromFromPosition(popupItem.position.x, popupItem.position.y);
    this.popupService.refresh();
  }



  public show(): void {
    if(this.isVisible) {
      return;
    }

    this.isVisible = true;
    this.init();
  }

  public hide(): boolean {
    if(!this.isVisible) {
      return false;
    }

    this.isVisible = false;
    this.removeAllPopupItems();

    return true;
  }

  public setPosition(x: number, y: number): void {
    this.position = {
      x: x,
      y: y
    };

    this.openPopupItems[0].position = this.position;
    this.openPopupItems[0].transform = PopupMenuComponent.getTransfromFromPosition(this.position.x, this.position.y);
    this.popupService.refresh();
  }

  public getPosition(): {x: number; y: number} {
    return this.position;
  }

  public getNativeElement(): any {
    return this.popupMenuElem.nativeElement;
  }

}