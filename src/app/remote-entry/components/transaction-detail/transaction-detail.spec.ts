import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDetail } from './transaction-detail';
import { ActivatedRoute } from '@angular/router';
import { LedgerService } from '../../../services/ledger-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { Transaction } from '../../../services/models/ledger.models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('TransactionDetail', () => {
  let component: TransactionDetail;
  let fixture: ComponentFixture<TransactionDetail>;
  let mockLedgerService: jest.Mocked<LedgerService>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockSpinnerService: jest.Mocked<NgxSpinnerService>;

  const mockTransaction: Transaction = {
    id: 't1',
    from: '1',
    to: '2',
    amount: 100,
    currency: 'USD',
    note: 'Test Transaction',
    timestamp: new Date().toISOString(),
  };

  beforeEach(async () => {
    mockLedgerService = {
      getTranscactionById: jest.fn().mockReturnValue(of(mockTransaction)),
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('t1'),
        },
      },
    } as any;

    mockSpinnerService = {
      show: jest.fn(),
      hide: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatCardModule, MatIconModule, TransactionDetail],
      providers: [
        { provide: LedgerService, useValue: mockLedgerService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetail);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch transaction details', () => {
    jest.useFakeTimers();
    component.ngOnInit();
    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockLedgerService.getTranscactionById).toHaveBeenCalledWith('t1');
    expect(component.transaction).toEqual(mockTransaction);
    jest.advanceTimersByTime(700);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should handle error when transaction is not found', () => {
    mockLedgerService.getTranscactionById.mockReturnValue(
      throwError(() => new Error('Not found'))
    );
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    component.ngOnInit();
    expect(mockLedgerService.getTranscactionById).toHaveBeenCalledWith('t1');
    expect(alertSpy).toHaveBeenCalledWith('Transaction not found');
    expect(component.transaction).toBeNull();
    alertSpy.mockRestore();
  });

  it('should not fetch transaction if id is null', () => {
    jest.useFakeTimers();
    (mockActivatedRoute.snapshot.paramMap.get as jest.Mock).mockReturnValue(
      null
    );
    component.ngOnInit();
    expect(mockLedgerService.getTranscactionById).not.toHaveBeenCalled();
    expect(component.transaction).toBeNull();
    expect(mockSpinnerService.show).toHaveBeenCalled();
    jest.advanceTimersByTime(700);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyNextSpy = jest.spyOn(component.destroy$, 'next');
    const destroyCompleteSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });
});
