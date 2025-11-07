interface AmadeusSignTransactionParams {
  contract: string;
  method: string;
  args: unknown[];
  description?: string;
}

interface AmadeusSignTransactionResult {
  txHash: string;
  txPacked: number[];
}

interface AmadeusProvider {
  isAmadeus: boolean;
  isConnected(): Promise<boolean>;
  getAccount(): Promise<string | null>;
  requestAccounts(): Promise<string[]>;
  signTransaction(params: AmadeusSignTransactionParams): Promise<AmadeusSignTransactionResult>;
  on(event: string, callback: (payload: unknown) => void): void;
  off(event: string, callback: (payload: unknown) => void): void;
}

interface Window {
  amadeus?: AmadeusProvider;
}

