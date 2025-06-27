import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accounts } from './accounts';
import { LedgerService } from '../../../services/ledger-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { Account } from '../../../services/models/ledger.models';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { displayedAccountColumns } from './models/account.model';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;
  let mockLedgerService: jest.Mocked<LedgerService>;
  let mockSpinnerService: jest.Mocked<NgxSpinnerService>;

  const mockAccounts: Account[] = [
    { id: '1', name: 'Test Account 1', currency: 'USD', balance: 1000 },
    { id: '2', name: 'Test Account 2', currency: 'EUR', balance: 2000 },
  ];

  beforeEach(async () => {
    mockLedgerService = {
      getAllAccounts: jest.fn().mockReturnValue(of(mockAccounts)),
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
        Accounts,
      ],
      providers: [
        { provide: LedgerService, useValue: mockLedgerService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch all accounts', () => {
    jest.useFakeTimers();
    component.ngOnInit();
    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockLedgerService.getAllAccounts).toHaveBeenCalled();
    expect(component.dataSource).toEqual(mockAccounts);
    expect(component.displayedColumns).toEqual(displayedAccountColumns);
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
    expect(component.dataSource).toEqual([]);
    consoleErrorSpy.mockRestore();
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyNextSpy = jest.spyOn(component.destroy$, 'next');
    const destroyCompleteSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });
});
