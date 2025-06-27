import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Account, Transaction, TransferRequest } from './models/ledger.models';

@Injectable({
  providedIn: 'root',
})
export class LedgerService {
  private readonly _httpClientService = inject(HttpClient);

  getAllAccounts(): Observable<Account[]> {
    return this._httpClientService
      .get<Account[]>(`/api/accounts`)
      .pipe(catchError(this.handleError));
  }

  getAccountById(id: string): Observable<Account> {
    return this._httpClientService
      .get<Account>(`/api/accounts/${id}`)
      .pipe(catchError(this.handleError));
  }

  getTransactions(filters?: {
    account?: string;
    currency?: string;
  }): Observable<Transaction[]> {
    const params = filters ? this.buildParams(filters) : new HttpParams();

    return this._httpClientService
      .get<Transaction[]>(`/api/transactions`, { params })
      .pipe(catchError(this.handleError));
  }

  getTranscactionById(id: string): Observable<Transaction> {
    return this._httpClientService
      .get<Transaction>(`/api/transactions/${id}`)
      .pipe(catchError(this.handleError));
  }

  makeTransfer(payload: TransferRequest): Observable<any> {
    return this._httpClientService
      .post(`/api/transactions/transfer`, payload)
      .pipe(catchError(this.handleError));
  }
  getScheduledTransactions(): Observable<Transaction[]> {
    return this._httpClientService
      .get<Transaction[]>(`/api/transactions/scheduled`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(
      () => new Error(error.error?.message || 'Something Went Wrong!')
    );
  }

  private buildParams(params: Record<string, string>): HttpParams {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return httpParams;
  }
}
