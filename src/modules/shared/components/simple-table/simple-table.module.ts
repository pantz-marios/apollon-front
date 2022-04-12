import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTableComponent } from './simple-table.component';





@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SimpleTableComponent
  ],
  exports: [
    SimpleTableComponent
  ]
})
export class SimpleTableModule {}