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
        path: 'transactions',
        loadComponent: () =>
          import('./components/transactions/transactions').then(
            (m) => m.Transactions
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
