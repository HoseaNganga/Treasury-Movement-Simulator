import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RemoteEntry } from './app/remote-entry/remote-entry';

bootstrapApplication(RemoteEntry, appConfig).catch((err) => console.error(err));
