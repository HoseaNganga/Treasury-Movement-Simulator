import { InjectionToken } from '@angular/core';
import { valueBasedProviderInterface } from './models/apiProvider.model';

export const VALUE_BASED_SERVICE_CONFIG =
  new InjectionToken<valueBasedProviderInterface>('valuebasedProviderConfig');

export const VALUE_BASED_CONFIG_VALUE: valueBasedProviderInterface = {
  apiEndpoint: 'https://ledger-backend-52wf.onrender.com',
};
