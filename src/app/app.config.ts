import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { remoteRoutes } from './remote-entry/remote-entry.route';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp } from '../core/environment.loader';
import {
  VALUE_BASED_CONFIG_VALUE,
  VALUE_BASED_SERVICE_CONFIG,
} from './services/apiProvider/apiProvider.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(remoteRoutes),
    provideAnimations(),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(),
    {
      provide: VALUE_BASED_SERVICE_CONFIG,
      useValue: VALUE_BASED_CONFIG_VALUE,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
    },
  ],
};
