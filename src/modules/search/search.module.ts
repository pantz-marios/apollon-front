import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { SearchRoutingModule } from '@modules/search/search-routing.module';
import { SearchPageComponent } from '@modules/search/page/search-page.component';
import { SearchBarComponent } from '@modules/search/components/search-bar/search-bar.component';
import { SharedModule } from '@modules/shared/shared.module';
import { LoadersModule } from '@modules/shared/components/loaders/loaders.module';
import { TilePaneModule } from '@modules/shared/components/tile-pane/tile-pane.module';
import { PopupModule } from '@modules/shared/components/popup/popup.module';





@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    SearchRoutingModule,
    SharedModule,
    LoadersModule,
    TilePaneModule,
    PopupModule
  ],
  declarations: [
    SearchPageComponent,
    SearchBarComponent
  ],
  exports: [
    SearchBarComponent
  ]
})
export class SearchModule {}
