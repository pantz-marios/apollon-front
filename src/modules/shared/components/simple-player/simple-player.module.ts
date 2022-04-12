import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';
import { SliderModule } from '@modules/shared/components/slider/slider.module';
import { LoadersModule } from '@modules/shared/components/loaders/loaders.module';
import { SimplePlayerComponent } from '@modules/shared/components/simple-player/simple-player.component';
import { SecsToHmsPipe } from '@modules/shared/components/simple-player/pipes/secs-to-hms.pipe';





@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SliderModule,
    LoadersModule
  ],
  declarations: [
    SimplePlayerComponent,
    SecsToHmsPipe
  ],
  exports: [
    SimplePlayerComponent,
    SecsToHmsPipe
  ]
})
export class SimplePlayerModule {}