import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgLoaderDirective } from '@modules/shared/directives/img-loader.directive';
import { DragAndDropDirective } from '@modules/shared/directives/drag-and-drop.directive';





@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ImgLoaderDirective,
    DragAndDropDirective
  ],
  exports: [
    ImgLoaderDirective,
    DragAndDropDirective
  ]
})
export class SharedModule {}