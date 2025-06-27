import { Routes } from '@angular/router';

export const remoteRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'accounts',
        loadComponent: () =>
          import('./components/accounts/accounts').then((m) => m.Accounts),
      },
      {
        path: 'accounts/:id',
        loadComponent: () =>
          import('./components/account-detail/account-detail').then(
            (m) => m.AccountDetail
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./components/transactions/transactions').then(
            (m) => m.Transactions
          ),
      },
      {
        path: 'transactions/:id',
        loadComponent: () =>
          import('./components/transaction-detail/transaction-detail').then(
            (m) => m.TransactionDetail
          ),
      },

      {
        path: 'transaction/transfer/:id',
        loadComponent: () =>
          import('./components/transaction-transfer/transaction-transfer').then(
            (m) => m.TransactionTransfer
          ),
      },
    ],
  },
];
