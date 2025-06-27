import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionTransfer } from './transaction-transfer';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerService } from '../../../services/ledger-service';
import { ToastService } from '../../../services/Toast/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Account } from '../../../services/models/ledger.models';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastComponent } from '../../../services/Toast/toast.component';

describe('TransactionTransfer', () => {
  let component: TransactionTransfer;
  let fixture: ComponentFixture<TransactionTransfer>;
  let mockLedgerService: jest.Mocked<LedgerService>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockRouter: jest.Mocked<Router>;
  let mockToastService: jest.Mocked<ToastService>;
  let mockSpinnerService: jest.Mocked<NgxSpinnerService>;
  let formBuilder: FormBuilder;

  const mockAccounts: Account[] = [
    { id: '1', name: 'Account 1', currency: 'USD', balance: 1000 },
    { id: '2', name: 'Account 2', currency: 'KES', balance: 50000 },
  ];

  beforeEach(async () => {
    mockLedgerService = {
      getAllAccounts: jest.fn().mockReturnValue(of(mockAccounts)),
      makeTransfer: jest.fn().mockReturnValue(of({})),
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'),
        },
      },
    } as any;

    mockRouter = {
      navigate: jest.fn(),
    } as any;

    mockToastService = {
      success: jest.fn(),
      error: jest.fn(),
    } as any;

    mockSpinnerService = {
      show: jest.fn(),
      hide: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
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
        TransactionTransfer,
      ],
      providers: [
        FormBuilder,
        { provide: LedgerService, useValue: mockLedgerService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionTransfer);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and fetch accounts', () => {
    jest.useFakeTimers();
    component.ngOnInit();
    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(component.fromAccountId).toBe('1');
    expect(mockLedgerService.getAllAccounts).toHaveBeenCalled();
    expect(component.allAccounts).toEqual(mockAccounts);
    expect(component.fromAccount).toEqual(mockAccounts[0]);
    expect(component.transferForm.get('fromId')?.value).toBe('1');
    expect(component.transferForm.get('fromId')?.disabled).toBe(true);
    expect(component.transferForm.get('toId')?.value).toBe('');
    expect(component.transferForm.get('amount')?.value).toBe('');
    expect(component.transferForm.get('note')?.value).toBe('');
    expect(component.transferForm.get('scheduledDate')?.value).toBe('');
    jest.advanceTimersByTime(700);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should handle error when fetching accounts fails', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockLedgerService.getAllAccounts.mockReturnValue(
      throwError(() => new Error('Fetch error'))
    );
    component.ngOnInit();
    expect(mockLedgerService.getAllAccounts).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(component.allAccounts).toEqual([]);
    expect(component.fromAccount).toBeUndefined();
    consoleErrorSpy.mockRestore();
  });

  it('should calculate exchange rate and converted amount when currencies differ', () => {
    component.ngOnInit();
    component.allAccounts = mockAccounts;
    component.fromAccount = mockAccounts[0]; // USD
    component.transferForm.patchValue({ toId: '2', amount: '100' }); // KES
    expect(component.exchangeRate).toBe(140); // USD_KES rate
    expect(component.convertedAmount).toBe(14000); // 100 * 140
  });

  it('should not calculate exchange rate when currencies are the same', () => {
    component.ngOnInit();
    component.allAccounts = [
      { id: '1', name: 'Account 1', currency: 'USD', balance: 1000 },
      { id: '2', name: 'Account 2', currency: 'USD', balance: 500 },
    ];
    component.fromAccount = component.allAccounts[0]; // USD
    component.transferForm.patchValue({ toId: '2', amount: '100' }); // USD
    expect(component.exchangeRate).toBeNull();
    expect(component.convertedAmount).toBeNull();
  });

  it('should submit transfer and navigate on success', () => {
    jest.useFakeTimers();
    component.ngOnInit();
    component.allAccounts = mockAccounts;
    component.fromAccount = mockAccounts[0];
    component.transferForm.patchValue({
      fromId: '1',
      toId: '2',
      amount: '100',
      note: 'Test transfer',
    });
    component.submitTransfer();
    expect(mockLedgerService.makeTransfer).toHaveBeenCalledWith({
      fromId: '1',
      toId: '2',
      amount: '100',
      note: 'Test transfer',
      scheduledDate: '',
    });
    expect(mockToastService.success).toHaveBeenCalledWith(
      'Transfer Completed!'
    );
    expect(component.transferForm.get('fromId')?.value).toBe('1');
    expect(component.transferForm.get('toId')?.value).toBe(null);
    expect(component.transferForm.get('amount')?.value).toBe(null);
    expect(component.exchangeRate).toBeNull();
    expect(component.convertedAmount).toBeNull();
    jest.advanceTimersByTime(2000);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transactions']);
    jest.useRealTimers();
  });

  it('should not submit transfer if form is invalid', () => {
    component.ngOnInit();
    component.fromAccount = mockAccounts[0];
    component.transferForm.patchValue({ toId: '', amount: '' }); // Invalid form
    component.submitTransfer();
    expect(mockLedgerService.makeTransfer).not.toHaveBeenCalled();
    expect(mockToastService.success).not.toHaveBeenCalled();
    expect(mockToastService.error).not.toHaveBeenCalled();
  });

  it('should handle error on transfer failure', () => {
    mockLedgerService.makeTransfer.mockReturnValue(
      throwError(() => new Error('Transfer failed'))
    );
    component.ngOnInit();
    component.allAccounts = mockAccounts;
    component.fromAccount = mockAccounts[0];
    component.transferForm.patchValue({
      fromId: '1',
      toId: '2',
      amount: '100',
    });
    component.submitTransfer();
    expect(mockLedgerService.makeTransfer).toHaveBeenCalled();
    expect(mockToastService.error).toHaveBeenCalledWith('Transfer failed');
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyNextSpy = jest.spyOn(component.destroy$, 'next');
    const destroyCompleteSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });
});
