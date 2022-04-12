import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { fromEvent, merge, Subscription } from "rxjs";
import * as uuid from 'uuid';
import { Popup } from "../service/popup-item.model";
import { PopupMenuComponent } from "../components/popup-menu/popup-menu.component";





@Directive({
  selector: "[popup-toggle]"
})
export class PopupToggleDirective implements OnInit, OnDestroy {
  private elementId: string;
  private popupToggleElemRef: any = null;
  private onClickDispose = null;
  private onWindowResize = null;
  private onWindowScroll = null;
  private hoverEventSubscription: Subscription = null;
  private clickEventSubscription: Subscription = null;
  private readonly POPUP_DATA_KEY = '__popup';

  @Input() popup: Popup;
  @Input() popupActivate: 'click' | 'hover';
  @Input() popupPlacement: string;
  @Input() popupClass: string;
  @Input() popupToggleClass: string;

  public readonly validPopupPlacements = [
    'TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT',
    'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT',
    'LEFT_TOP', 'LEFT_CENTER', 'LEFT_BOTTOM',
    'RIGHT_TOP', 'RIGHT_CENTER', 'RIGHT_BOTTOM'
  ];
    


  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}



  public ngOnInit(): void {
    if(this.popupActivate == null || (this.popupActivate !== 'click' && this.popupActivate !== 'hover')) {
      this.popupActivate = 'hover';
    }

    // get the reference of the popup's toggle element and create a unique id for this popup
    this.popupToggleElemRef = this.el.nativeElement;
    this.elementId = uuid.v4();
    
    // hide popup by default
    this.hidePopup(this.popup);

    if(this.popupActivate === 'hover') {
      this.initHoverPopup(this.popupToggleElemRef);
    }
    else {
      this.initClickPopup(this.popupToggleElemRef);
    }
  }

  public ngOnDestroy(): void {
    if(this.onClickDispose != null) {
      this.onClickDispose();
    }

    if(this.onWindowResize != null) {
      this.onWindowResize();
    }

    if(this.onWindowScroll != null) {
      window.removeEventListener('scroll', this.onWindowScroll, true);
    }

    if(this.hoverEventSubscription != null) {
      this.hoverEventSubscription.unsubscribe();
    }

    if(this.clickEventSubscription != null) {
      this.clickEventSubscription.unsubscribe();
    }

    delete this.renderer.data[this.POPUP_DATA_KEY]['popups'][this.elementId];
    if(Object.getOwnPropertyNames(this.renderer.data[this.POPUP_DATA_KEY]['popups']).length === 0) {
      delete this.renderer.data[this.POPUP_DATA_KEY];
    }
  }



  private initHoverPopup(popupToggleElemRef: any): void {
    if(this.popupActivate !== 'hover') {
      return;
    }

    // install event listeners to show/hide popup on mouse over/exit of the popup toggle
    this.hoverEventSubscription = merge(
      fromEvent(popupToggleElemRef, "mouseenter"),
      fromEvent(popupToggleElemRef, "mouseleave")
    )
    .subscribe((e: any) => this.mouseHoverHandler(e));
  }

  private initClickPopup(popupToggleElemRef: any): void {
    if(this.popupActivate !== 'click') {
      return;
    }

    // store all popup references and initialize document click listener
    if(this.renderer.data[this.POPUP_DATA_KEY] == undefined) {
      this.renderer.data[this.POPUP_DATA_KEY] = {
          'popups': {},
          'visible_popup': null
      };

      this.onClickDispose = this.renderer.listen('window', 'click',(e:Event) => {
          const clickInside = this.clickedPopupOrToggle(e);
          if(!clickInside) {
            const visiblePopupId = this.hideVisiblePopup();
          }
      });

      this.onWindowResize = this.renderer.listen('window', 'resize',(e:Event) => {
        const visiblePopupId = this.hideVisiblePopup();
      });

      this.onWindowScroll = (e) => {
        const visiblePopupId = this.hideVisiblePopup();
      };

      window.addEventListener('scroll', this.onWindowScroll, true);
    }

    // store this popup and it's toggle
    this.renderer.data[this.POPUP_DATA_KEY]['popups'][this.elementId] = {
      'popup': this.popup,
      'toggle': popupToggleElemRef,
    }

    // install event listeners to show/hide popup on mouse click of the popup toggle
    this.clickEventSubscription = merge(
      fromEvent(popupToggleElemRef, "click")
    )
    .subscribe((e: any) => {
      // hide visible popup
      const visiblePopupId = this.hideVisiblePopup();

      // show popup 
      if(visiblePopupId == null || (visiblePopupId != null && visiblePopupId !== this.elementId)) {
        this.renderer.data[this.POPUP_DATA_KEY]['visible_popup'] = this.elementId;
        this.showPopup(this.popup);
      }
    });
  }
  


  private mouseHoverHandler(e: any): void {
    if(e.type === 'mouseenter') {
      this.showPopup(this.popup);
    }
    else {
      this.hidePopup(this.popup);
    }
  }



  private hideVisiblePopup(): any {

    // hide visible Popup
    if(this.renderer.data[this.POPUP_DATA_KEY]['visible_popup'] != null) {
      const visiblePopupId = this.renderer.data[this.POPUP_DATA_KEY]['visible_popup'];
      const visiblePopup = this.renderer.data[this.POPUP_DATA_KEY]['popups'][visiblePopupId]['popup'];
      this.renderer.data[this.POPUP_DATA_KEY]['visible_popup'] = null;

      const wasVisible = this.hidePopup(visiblePopup);

      if(!wasVisible) {
        return null;
      }

      return visiblePopupId;
    }

    return null;
  }

  /**
   * 
   * Return whether the user clicked inside ANY popup element or popup toggle element.
   * 
   */
  private clickedPopupOrToggle(e: any): boolean {
    if(this.renderer.data[this.POPUP_DATA_KEY] == null) {
        return false;
    }

    const popupIDs = Object.getOwnPropertyNames(this.renderer.data[this.POPUP_DATA_KEY]['popups']);
    const clickedElement = e.target;

    for(const popupId of popupIDs) {
        const popup = this.renderer.data[this.POPUP_DATA_KEY]['popups'][popupId];
        const popupElement = popup['popup'];
        const toggleElement = popup['toggle'];

        if(clickedElement === popupElement || clickedElement === toggleElement || this.hasClass(clickedElement, this.popupClass) || this.hasClass(clickedElement, this.popupToggleClass)) {
            return true;
        }
    }

    return false;
  }

  private hasClass(element, className): boolean {
    do {
      if (element.classList && element.classList.contains(className)) {
        return true;
      }
      element = element.parentNode;
    } while (element);

    return false;
  }



  private updatePopupPosition(popup: Popup, popupPlacement: string): void {
    // set default popup placement if it is required
    if(popupPlacement == null || !this.validPopupPlacements.includes(popupPlacement)) {
      popupPlacement = 'TOP_CENTER';
    }

    // get toggle element's and Popup element's size and position information
    const toggleRect = this.popupToggleElemRef.getBoundingClientRect();
    const popupRect = popup.getNativeElement().getBoundingClientRect();

    // get popup element position
    let popupPosition = this.getPopupPosition(toggleRect, popupRect, popupPlacement);
    if(popupPosition == null) {
      return;
    }

    // check whether the popup overflows the window
    const windowSize = this.getWindowSize();
    const viewportOverflownHorizontally = windowSize.width < popupPosition.x + popupRect.width;
    const viewportOverflownVertically = windowSize.height < popupPosition.y + popupRect.height;

    // if the viewport is overflown horizontally, flip Popup's placement horizontally
    if(viewportOverflownHorizontally) {
      popupPlacement = this.flipPopupPlacementHorizonally(popupPlacement);
    }

    // if the viewport is overflown vertically, flip Popup's placement vertically
    if(viewportOverflownVertically) {
      popupPlacement = this.flipPopupPlacementVertically(popupPlacement);
    }

    // get popup element position
    popupPosition = this.getPopupPosition(toggleRect, popupRect, popupPlacement);
    if(popupPosition == null) {
      return;
    }

    // position Popup
    this.positionPopup(popup, popupPosition.x, popupPosition.y);
  }

  private showPopup(popup: Popup): void {
    popup.show();

    const subscription = (<PopupMenuComponent>popup).onShown.subscribe((e) => {
      this.updatePopupPosition(popup, this.popupPlacement);
      subscription.unsubscribe();
    });
  }

  private hidePopup(popup: Popup): boolean {
    return popup.hide();
  }

  private positionPopup(popup: Popup, x: number, y: number): void {
    popup.setPosition(x, y);
  }

  private getPopupPosition(toggleRect: any, popupRect: any, popupPlacement: string): {x: number; y: number;} {

    if(popupPlacement === 'TOP_LEFT') {
      return {x: toggleRect.left, y: toggleRect.top - popupRect.height};
    }
    else if(popupPlacement === 'TOP_CENTER') {
      return {x: toggleRect.left + toggleRect.width/2 - popupRect.width/2, y: toggleRect.top - popupRect.height};
    }
    else if(popupPlacement === 'TOP_RIGHT') {
      return {x: toggleRect.right - popupRect.width, y: toggleRect.top - popupRect.height};
    }
    else if(popupPlacement === 'BOTTOM_LEFT') {
      return {x: toggleRect.left, y: toggleRect.top + toggleRect.height};
    }
    else if(popupPlacement === 'BOTTOM_CENTER') {
      return {x: toggleRect.left + toggleRect.width/2 - popupRect.width/2, y: toggleRect.top + toggleRect.height};
    }
    else if(popupPlacement === 'BOTTOM_RIGHT') {
      return {x: toggleRect.right - popupRect.width, y: toggleRect.top + toggleRect.height};
    }
    else if(popupPlacement === 'LEFT_TOP') {
      return {x: toggleRect.left - popupRect.width, y: toggleRect.top};
    }
    else if(popupPlacement === 'LEFT_CENTER') {
      return {x: toggleRect.left - popupRect.width, y: toggleRect.top + toggleRect.height/2 - popupRect.height/2};
    }
    else if(popupPlacement === 'LEFT_BOTTOM') {
      return {x: toggleRect.left - popupRect.width, y: toggleRect.bottom - popupRect.height};
    }
    else if(popupPlacement === 'RIGHT_TOP') {
      return {x: toggleRect.left + toggleRect.width, y: toggleRect.top};
    }
    else if(popupPlacement === 'RIGHT_CENTER') {
      return {x: toggleRect.left + toggleRect.width, y: toggleRect.top + toggleRect.height/2 - popupRect.height/2};
    }
    else if(popupPlacement === 'RIGHT_BOTTOM') {
      return {x: toggleRect.left + toggleRect.width, y: toggleRect.bottom - popupRect.height};
    }  

    return null;
  }

  private flipPopupPlacementHorizonally(popupPlacement: string): string {

    if(popupPlacement === 'TOP_LEFT') {
      return 'TOP_RIGHT';
    }
    else if(popupPlacement === 'TOP_CENTER') {
      return 'TOP_CENTER';
    }
    else if(popupPlacement === 'TOP_RIGHT') {
      return 'TOP_LEFT';
    }
    else if(popupPlacement === 'BOTTOM_LEFT') {
      return 'BOTTOM_RIGHT';
    }
    else if(popupPlacement === 'BOTTOM_CENTER') {
      return 'BOTTOM_CENTER';
    }
    else if(popupPlacement === 'BOTTOM_RIGHT') {
      return 'BOTTOM_LEFT';
    }
    else if(popupPlacement === 'LEFT_TOP') {
      return 'RIGHT_TOP';
    }
    else if(popupPlacement === 'LEFT_CENTER') {
      return 'RIGHT_CENTER';
    }
    else if(popupPlacement === 'LEFT_BOTTOM') {
      return 'RIGHT_BOTTOM';
    }
    else if(popupPlacement === 'RIGHT_TOP') {
      return 'LEFT_TOP';
    }
    else if(popupPlacement === 'RIGHT_CENTER') {
      return 'LEFT_CENTER';
    }
    else if(popupPlacement === 'RIGHT_BOTTOM') {
      return 'LEFT_BOTTOM';
    }  

    return null;
  }

  private flipPopupPlacementVertically(popupPlacement: string): string {
    
    if(popupPlacement === 'TOP_LEFT') {
      return 'BOTTOM_LEFT';
    }
    else if(popupPlacement === 'TOP_CENTER') {
      return 'BOTTOM_CENTER';
    }
    else if(popupPlacement === 'TOP_RIGHT') {
      return 'BOTTOM_RIGHT';
    }
    else if(popupPlacement === 'BOTTOM_LEFT') {
      return 'TOP_LEFT';
    }
    else if(popupPlacement === 'BOTTOM_CENTER') {
      return 'TOP_CENTER';
    }
    else if(popupPlacement === 'BOTTOM_RIGHT') {
      return 'TOP_RIGHT';
    }
    else if(popupPlacement === 'LEFT_TOP') {
      return 'LEFT_BOTTOM';
    }
    else if(popupPlacement === 'LEFT_CENTER') {
      return 'LEFT_CENTER'
    }
    else if(popupPlacement === 'LEFT_BOTTOM') {
      return 'LEFT_TOP';
    }
    else if(popupPlacement === 'RIGHT_TOP') {
      return 'RIGHT_BOTTOM';
    }
    else if(popupPlacement === 'RIGHT_CENTER') {
      return 'RIGHT_CENTER';
    }
    else if(popupPlacement === 'RIGHT_BOTTOM') {
      return 'RIGHT_TOP';
    }  

    return null;
  }

  private getWindowSize(): {width: number, height: number} {
    return {width: window.innerWidth, height: window.innerHeight};
  }

}