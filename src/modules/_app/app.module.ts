import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@modules/_app/app-routing.module';
import { AppComponent } from '@modules/_app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { PlayerModule } from '@modules/player/player.module';
import { SearchModule } from '@modules/search/search.module';
import { PopupModule } from '@modules/shared/components/popup/popup.module';
import { SimplePlayerModule } from '@modules/shared/components/simple-player/simple-player.module';





@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    PlayerModule,
    SearchModule,
    PopupModule,
    SimplePlayerModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
