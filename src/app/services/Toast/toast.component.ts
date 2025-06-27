import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from './toast.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="toast"
      [ngClass]="toastClasses[toast.type]"
      class="fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg animate-slide-in"
    >
      {{ toast.message }}
    </div>
  `,
  styles: [
    `
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }

      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .toast-success {
        background-color: #22c55e;
        color: white;
      }
      .toast-error {
        background-color: #ef4444;
        color: white;
      }
      .toast-info {
        background-color: #3b82f6;
        color: white;
      }
    `,
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: ToastMessage | null = null;
  private sub = new Subscription();

  toastClasses: Record<string, string> = {
    success: 'toast-success',
    error: 'toast-error',
    info: 'toast-info',
  };

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;

      timer(3000).subscribe(() => {
        this.toast = null;
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
