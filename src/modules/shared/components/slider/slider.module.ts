import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';
import { SliderComponent } from './slider.component';





@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    SliderComponent
  ],
  exports: [
    SliderComponent
  ]
})
export class SliderModule {}