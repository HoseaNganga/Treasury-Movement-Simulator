import { Component, inject } from '@angular/core';
import { NavComponent } from '../global/nav/nav.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [NavComponent, NgxSpinnerModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class Layout {
  private readonly _ngxSpinnerService = inject(NgxSpinnerService);
  private readonly _routerService = inject(Router);

  ngOnInit(): void {
    this._routerService.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
    this._ngxSpinnerService.show();

    setTimeout(() => {
      this._ngxSpinnerService.hide();
    }, 3000);
  }
}
