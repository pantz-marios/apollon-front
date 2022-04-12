import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TilePaneComponent } from './tile-pane.component';





@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TilePaneComponent
  ],
  exports: [
    TilePaneComponent
  ]
})
export class TilePaneModule {}