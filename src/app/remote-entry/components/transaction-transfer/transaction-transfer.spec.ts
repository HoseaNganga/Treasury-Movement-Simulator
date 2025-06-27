import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTransfer } from './transaction-transfer';

describe('TransactionTransfer', () => {
  let component: TransactionTransfer;
  let fixture: ComponentFixture<TransactionTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTransfer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionTransfer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
