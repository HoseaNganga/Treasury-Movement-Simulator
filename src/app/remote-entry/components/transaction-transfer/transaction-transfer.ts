import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Account } from '../../../services/models/ledger.models';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerService } from '../../../services/ledger-service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastService } from '../../../services/Toast/toast.service';
import { ToastComponent } from '../../../services/Toast/toast.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transaction-transfer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastComponent,
  ],
  templateUrl: './transaction-transfer.html',
  styleUrl: './transaction-transfer.scss',
})
export class TransactionTransfer implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly ledgerService = inject(LedgerService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
  transferForm!: FormGroup;
  allAccounts: Account[] = [];
  fromAccount!: Account | undefined;
  exchangeRate: number | null = null;
  convertedAmount: number | null = null;
  destroy$ = new Subject<void>();
  fromAccountId!: string | null;

  ngOnInit(): void {
    this._NgxSpinnerService.show();
    this.fromAccountId = this.activatedRoute.snapshot.paramMap.get('id');
    this.transferForm = this.fb.group({
      fromId: [{ value: '', disabled: true }, Validators.required],
      toId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      note: [''],
      scheduledDate: [''],
    });
    this.getAllAccounts();
    this.setupValueChangeWatcher();
    setTimeout(() => {
      this._NgxSpinnerService.hide();
    }, 700);
  }

  private getAllAccounts() {
    this.ledgerService
      .getAllAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.allAccounts = res;

          this.fromAccount = res.find((acc) => acc.id === this.fromAccountId);
          if (this.fromAccount) {
            this.transferForm.patchValue({ fromId: this.fromAccount.id });
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  private setupValueChangeWatcher(): void {
    this.transferForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        const toAccount = this.allAccounts.find((a) => a.id === val.toId);
        const amount = val.amount;

        if (
          this.fromAccount &&
          toAccount &&
          this.fromAccount.currency !== toAccount.currency &&
          amount
        ) {
          const fxKey = `${this.fromAccount.currency}_${toAccount.currency}`;
          const FX_RATES: Record<string, number> = {
            USD_KES: 140,
            KES_USD: 1 / 140,
            USD_NGN: 770,
            NGN_USD: 1 / 770,
            KES_NGN: 770 / 140,
            NGN_KES: 140 / 770,
            USD_ZAR: 18,
            ZAR_USD: 1 / 18,
            KES_ZAR: 18 / 140,
            ZAR_KES: 140 / 18,
            NGN_ZAR: 18 / 770,
            ZAR_NGN: 770 / 18,
          };

          this.exchangeRate = FX_RATES[fxKey] ?? null;
          this.convertedAmount =
            this.exchangeRate && amount
              ? this.exchangeRate * Number(amount)
              : null;
        } else {
          this.exchangeRate = null;
          this.convertedAmount = null;
        }
      });
  }
  submitTransfer(): void {
    if (this.transferForm.invalid || !this.fromAccount) return;

    const formData = {
      ...this.transferForm.getRawValue(),
    };

    this.ledgerService.makeTransfer(formData).subscribe({
      next: () => {
        this.toastService.success('Transfer Completed!');
        this.transferForm.reset();
        this.transferForm.patchValue({ fromId: this.fromAccount?.id });

        this.exchangeRate = null;
        this.convertedAmount = null;
        setTimeout(() => {
          this.router.navigate(['/transactions']);
        }, 2000);
      },
      error: (err) => {
        console.log(err);
        this.toastService.error(err.message || 'An error occured on Transfer');
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
