import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayingNowComponent } from '@modules/player/page/playing-now.component';



const routes: Routes = [
  {
    path: '',
    component: PlayingNowComponent,
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PlayerRoutingModule {}
