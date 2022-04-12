import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';
import { SliderModule } from '@modules/shared/components/slider/slider.module';
import { LoadersModule } from '@modules/shared/components/loaders/loaders.module';
import { PlayerRoutingModule } from '@modules/player/player-routing.module';
import { SimplePlayerModule } from '@modules/shared/components/simple-player/simple-player.module';
import { SimpleTableModule } from '@modules/shared/components/simple-table/simple-table.module';
import { PlayingNowComponent } from '@modules/player/page/playing-now.component';
import { PlayerControlsComponent } from '@modules/player/components/player-controls/player-controls.component';
import { QueueTableComponent } from '@modules/player/components/queue-table/queue-table.component';




@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SliderModule,
    LoadersModule,
    PlayerRoutingModule,
    SimplePlayerModule,
    SimpleTableModule
  ],
  declarations: [
    PlayingNowComponent,
    PlayerControlsComponent,
    QueueTableComponent
  ],
  exports: [
    PlayerControlsComponent
  ]
})
export class PlayerModule {}