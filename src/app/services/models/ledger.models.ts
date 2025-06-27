export interface Account {
  id: string;
  name: string;
  currency: string;
  balance: number;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  note?: string;
  timestamp: string;
  scheduledDate?: string;
  fxRate?: number;
}

export interface TransferRequest {
  fromId: string;
  toId: string;
  amount: number;
  note?: string;
  scheduledDate?: string;
}
