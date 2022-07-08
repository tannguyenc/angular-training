import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function getAPI() {
  // if (environment.production) {
  //   return '/';
  // }
  return environment.api;
}

const providers = [
  { provide: 'BASE_API', useFactory: getAPI, deps: [] },
];

platformBrowserDynamic(providers)
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
