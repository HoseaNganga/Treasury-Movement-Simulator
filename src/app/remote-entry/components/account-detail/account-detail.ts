import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerService } from '../../../services/ledger-service';
import { Account, Transaction } from '../../../services/models/ledger.models';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-account-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],

  templateUrl: './account-detail.html',
  styleUrl: './account-detail.scss',
})
export class AccountDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private ledgerService = inject(LedgerService);
  private router = inject(Router);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
  destroy$ = new Subject<void>();
  account: Account | null = null;
  recentTransactions: Transaction[] = [];

  ngOnInit(): void {
    this._NgxSpinnerService.show();
    const accountId = this.route.snapshot.paramMap.get('id');
    if (!accountId) return;

    this.ledgerService
      .getAccountById(accountId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (account) => {
          this.account = account;
          this.fetchRecentTransactions(account.id);
        },
        error: () => alert('Account not found'),
      });
    setTimeout(() => {
      this._NgxSpinnerService.hide();
    }, 700);
  }

  fetchRecentTransactions(accountId: string) {
    this.ledgerService
      .getTransactions({ account: accountId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          this.recentTransactions = transactions.slice(0, 5);
        },
      });
  }

  transferFunds() {
    if (this.account) {
      this.router.navigate(['/transaction/transfer', this.account.id]);
    }
  }

  viewTransactions() {
    if (this.account) {
      this.router.navigate(['/transactions'], {
        queryParams: { account: this.account.id },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
