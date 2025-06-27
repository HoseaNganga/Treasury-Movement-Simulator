import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { remoteRoutes } from './remote-entry.route';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(remoteRoutes, {
      onSameUrlNavigation: 'reload',
      initialNavigation: 'enabledBlocking',
    }),
  ],
})
export class RemoteEntryModule {}
