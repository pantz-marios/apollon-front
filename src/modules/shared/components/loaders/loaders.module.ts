import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleLoaderComponent } from './ripple-loader/ripple-loader.component';
import { DotsLoaderComponent } from './dots-loader/dots-loader.component';





@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RippleLoaderComponent,
    DotsLoaderComponent
  ],
  exports: [
    RippleLoaderComponent,
    DotsLoaderComponent
  ]
})
export class LoadersModule {}