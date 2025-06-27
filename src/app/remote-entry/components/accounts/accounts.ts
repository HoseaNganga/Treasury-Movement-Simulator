import { Component, inject, OnInit } from '@angular/core';
import { displayedAccountColumns } from './models/account.model';
import { Account } from '../../../services/models/ledger.models';
import { LedgerService } from '../../../services/ledger-service';
import { Subject, takeUntil } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-accounts',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
})
export class Accounts implements OnInit {
  private readonly ledgerService = inject(LedgerService);
  displayedColumns: string[] = displayedAccountColumns;
  dataSource: Account[] = [];
  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.getAllAccounts();
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

}
