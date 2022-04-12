import { enableProdMode, ApplicationRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableDebugTools } from '@angular/platform-browser';
import { AppModule } from '@modules/_app/app.module';
import { environment } from '@env/environment';





if (environment.production) {
  // window.console.log = function () {};
  enableProdMode();
}




// platformBrowserDynamic()
// .bootstrapModule(AppModule)
// .catch(err => console.error(err));



// in order to be able to run  'ng.profiler.timeChangeDetection()'  in console
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((moduleRef) => {
    const applicationRef = moduleRef.injector.get(ApplicationRef);
    const appComponent = applicationRef.components[0];
    enableDebugTools(appComponent);
  })
  .catch((err) => console.log(err));
