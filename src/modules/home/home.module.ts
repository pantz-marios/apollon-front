import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';





@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
