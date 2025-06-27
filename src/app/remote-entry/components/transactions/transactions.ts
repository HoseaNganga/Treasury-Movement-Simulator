import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Transaction } from '../../../services/models/ledger.models';
import { displayedTransactionColumns } from './models/transactions.model';
import { LedgerService } from '../../../services/ledger-service';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-transactions',
  imports: [
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions implements OnInit, OnDestroy {
  private readonly ledgerService = inject(LedgerService);
  allTransactions: Transaction[] = [];
  scheduledTransactions: Transaction[] = [];
  displayedTransactions: Transaction[] = [];
  selectedView: 'all' | 'scheduled' = 'all';
  displayedColumns: string[] = displayedTransactionColumns;
  destroy$ = new Subject<void>();
  filters = {
    account: '',
    currency: '',
  };

  ngOnInit(): void {
    this.loadAllTransactions();
    this.loadScheduledTransactions();
  }

  loadAllTransactions() {
    this.ledgerService
      .getTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.allTransactions = res;
          if (this.selectedView === 'all') {
            this.applyFilters();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  loadScheduledTransactions() {
    this.ledgerService
      .getScheduledTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.scheduledTransactions = res;
          if (this.selectedView === 'scheduled') {
            this.applyFilters();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  updateDisplayed(view: 'all' | 'scheduled') {
    this.selectedView = view;
    this.applyFilters();
  }

  applyFilters() {
    const { account, currency } = this.filters;
    const baseList =
      this.selectedView === 'all'
        ? this.allTransactions
        : this.scheduledTransactions;

    this.displayedTransactions = baseList.filter((txn) => {
      const matchesAccount =
        !account ||
        txn.from.toLowerCase().includes(account.toLowerCase()) ||
        txn.to.toLowerCase().includes(account.toLowerCase());

      const matchesCurrency =
        !currency ||
        txn.currency.toLowerCase().includes(currency.toLowerCase());

      return matchesAccount && matchesCurrency;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
