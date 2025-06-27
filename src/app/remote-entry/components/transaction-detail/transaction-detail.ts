import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LedgerService } from '../../../services/ledger-service';
import { Transaction } from '../../../services/models/ledger.models';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transaction-detail',
  imports: [CommonModule, MatCardModule, MatIconModule],

  templateUrl: './transaction-detail.html',
  styleUrl: './transaction-detail.scss',
})
export class TransactionDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly ledgerService = inject(LedgerService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
  transaction: Transaction | null = null;

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this._NgxSpinnerService.show();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ledgerService
        .getTranscactionById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (txn) => (this.transaction = txn),
          error: () => alert('Transaction not found'),
        });
    }
    setTimeout(() => {
      this._NgxSpinnerService.hide();
    }, 700);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
