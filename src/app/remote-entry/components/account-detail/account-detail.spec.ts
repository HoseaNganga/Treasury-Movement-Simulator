import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountDetail } from './account-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerService } from '../../../services/ledger-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { Account, Transaction } from '../../../services/models/ledger.models';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

describe('AccountDetail', () => {
  let component: AccountDetail;
  let fixture: ComponentFixture<AccountDetail>;
  let mockLedgerService: jest.Mocked<LedgerService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockSpinnerService: jest.Mocked<NgxSpinnerService>;

  const mockAccount: Account = {
    id: '1',
    name: 'Test Account',
    currency: 'USD',
    balance: 1000,
  };

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
      from: '1',
      to: '3',
      amount: 200,
      currency: 'USD',
      note: 'Test Transaction 2',
      timestamp: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    mockLedgerService = {
      getAccountById: jest.fn().mockReturnValue(of(mockAccount)),
      getTransactions: jest.fn().mockReturnValue(of(mockTransactions)),
    } as any;

    mockRouter = {
      navigate: jest.fn(),
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'),
        },
      },
    } as any;

    mockSpinnerService = {
      show: jest.fn(),
      hide: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        AccountDetail,
      ],
      providers: [
        { provide: LedgerService, useValue: mockLedgerService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetail);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch account details', () => {
    jest.useFakeTimers();
    component.ngOnInit();
    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockLedgerService.getAccountById).toHaveBeenCalledWith('1');
    expect(component.account).toEqual(mockAccount);
    expect(mockLedgerService.getTransactions).toHaveBeenCalledWith({
      account: '1',
    });
    expect(component.recentTransactions).toEqual(mockTransactions);
    jest.advanceTimersByTime(700);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should handle error when account is not found', () => {
    mockLedgerService.getAccountById.mockReturnValue(
      throwError(() => new Error('Not found'))
    );
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    component.ngOnInit();
    expect(mockLedgerService.getAccountById).toHaveBeenCalledWith('1');
    expect(alertSpy).toHaveBeenCalledWith('Account not found');
    alertSpy.mockRestore();
  });

  it('should navigate to transfer funds page', () => {
    component.account = mockAccount;
    component.transferFunds();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/transaction/transfer',
      '1',
    ]);
  });

  it('should navigate to transactions page with query params', () => {
    component.account = mockAccount;
    component.viewTransactions();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transactions'], {
      queryParams: { account: '1' },
    });
  });

  it('should not navigate if account is null', () => {
    component.account = null;
    component.transferFunds();
    component.viewTransactions();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyNextSpy = jest.spyOn(component.destroy$, 'next');
    const destroyCompleteSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });
});
