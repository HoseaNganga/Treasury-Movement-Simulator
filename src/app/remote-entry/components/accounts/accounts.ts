import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { displayedAccountColumns } from './models/account.model';
import { Account } from '../../../services/models/ledger.models';
import { LedgerService } from '../../../services/ledger-service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-accounts',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
})
export class Accounts implements OnInit, OnDestroy {
  private readonly ledgerService = inject(LedgerService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
  displayedColumns: string[] = displayedAccountColumns;
  dataSource: Account[] = [];
  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this._NgxSpinnerService.show();

    this.getAllAccounts();
    setTimeout(() => {
      this._NgxSpinnerService.hide();
    }, 700);
  }

  getAllAccounts() {
    this.ledgerService
      .getAllAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.dataSource = res;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
