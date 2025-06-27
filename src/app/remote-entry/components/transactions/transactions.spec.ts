import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Transactions } from './transactions';
import { LedgerService } from '../../../services/ledger-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { Transaction } from '../../../services/models/ledger.models';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { displayedTransactionColumns } from './models/transactions.model';

describe('Transactions', () => {
  let component: Transactions;
  let fixture: ComponentFixture<Transactions>;
  let mockLedgerService: jest.Mocked<LedgerService>;
  let mockSpinnerService: jest.Mocked<NgxSpinnerService>;

  const mockTransactions: Transaction[] = [
    {
      id: 't1',
      from: '1',
      to: '2',
      amount: 100,
      currency: 'USD',
      note: 'Test Transaction 1',
      timestamp: new Date().toISOString(),
    },
    {
      id: 't2',
      from: '2',
      to: '3',
      amount: 200,
      currency: 'KES',
      note: 'Test Transaction 2',
      timestamp: new Date().toISOString(),
    },
  ];

  const mockScheduledTransactions: Transaction[] = [
    {
      id: 't3',
      from: '1',
      to: '3',
      amount: 150,
      currency: 'USD',
      note: 'Scheduled Transaction',
      timestamp: new Date().toISOString(),
      scheduledDate: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    mockLedgerService = {
      getTransactions: jest.fn().mockReturnValue(of(mockTransactions)),
      getScheduledTransactions: jest
        .fn()
        .mockReturnValue(of(mockScheduledTransactions)),
    } as any;

    mockSpinnerService = {
      show: jest.fn(),
      hide: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        FormsModule,
        MatFormFieldModule,
        Transactions,
      ],
      providers: [
        { provide: LedgerService, useValue: mockLedgerService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Transactions);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load transactions', () => {
    jest.useFakeTimers();
    component.ngOnInit();
    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockLedgerService.getTransactions).toHaveBeenCalled();
    expect(mockLedgerService.getScheduledTransactions).toHaveBeenCalled();
    expect(component.allTransactions).toEqual(mockTransactions);
    expect(component.scheduledTransactions).toEqual(mockScheduledTransactions);
    expect(component.displayedTransactions).toEqual(mockTransactions);
    expect(component.selectedView).toBe('all');
    expect(component.displayedColumns).toEqual(displayedTransactionColumns);
    jest.advanceTimersByTime(700);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should handle error when loading all transactions fails', () => {
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    mockLedgerService.getTransactions.mockReturnValue(
      throwError(() => new Error('Fetch error'))
    );
    component.ngOnInit();
    expect(mockLedgerService.getTransactions).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(component.allTransactions).toEqual([]);
    expect(component.displayedTransactions).toEqual([]);
    consoleLogSpy.mockRestore();
  });

  it('should handle error when loading scheduled transactions fails', () => {
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    mockLedgerService.getScheduledTransactions.mockReturnValue(
      throwError(() => new Error('Fetch error'))
    );
    component.ngOnInit();
    expect(mockLedgerService.getScheduledTransactions).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(component.scheduledTransactions).toEqual([]);
    expect(component.displayedTransactions).toEqual(mockTransactions); 
    consoleLogSpy.mockRestore();
  });

  it('should switch to scheduled view and update displayed transactions', () => {
    component.ngOnInit();
    component.updateDisplayed('scheduled');
    expect(component.selectedView).toBe('scheduled');
    expect(component.displayedTransactions).toEqual(mockScheduledTransactions);
  });

  it('should apply filters for account and currency', () => {
    component.ngOnInit();
    component.filters = { account: '1', currency: 'USD' };
    component.applyFilters();
    expect(component.displayedTransactions).toEqual([mockTransactions[0]]); // Only t1 matches account '1' and currency 'USD'
  });

  it('should apply filters with no account or currency specified', () => {
    component.ngOnInit();
    component.filters = { account: '', currency: '' };
    component.applyFilters();
    expect(component.displayedTransactions).toEqual(mockTransactions);
  });

  it('should apply filters for scheduled transactions', () => {
    component.ngOnInit();
    component.updateDisplayed('scheduled');
    component.filters = { account: '1', currency: 'USD' };
    component.applyFilters();
    expect(component.displayedTransactions).toEqual([
      mockScheduledTransactions[0],
    ]);
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyNextSpy = jest.spyOn(component.destroy$, 'next');
    const destroyCompleteSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });
});
