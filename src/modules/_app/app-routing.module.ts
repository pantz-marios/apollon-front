import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';





const routes: Routes = [
  {
    path: 'home',
    loadChildren: 'modules/home/home.module#HomeModule',
  },
  {
    path: 'search',
    loadChildren: 'modules/search/search.module#SearchModule',
  },
  {
    path: 'playing-now',
    loadChildren: 'modules/player/player.module#PlayerModule',
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];





@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  // imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
