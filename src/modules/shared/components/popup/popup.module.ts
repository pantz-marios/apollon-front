import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupContainerComponent } from './components/popup-container/popup-container.component';
import { PopupMenuComponent } from './components/popup-menu/popup-menu.component';
import { PopupToggleDirective } from './directives/popup-toggle.directive';
import { ElemRefDirective } from './directives/element-ref.directive';





@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PopupContainerComponent,
    PopupMenuComponent,
    PopupToggleDirective,
    ElemRefDirective
  ],
  exports: [
    PopupContainerComponent,
    PopupMenuComponent,
    PopupToggleDirective,
    ElemRefDirective
  ]
})
export class PopupModule {}