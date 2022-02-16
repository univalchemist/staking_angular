import { EthereumEventName } from '@core/enums';


export interface ConnectInfo {
  chainId: string;
}

export interface ProviderMessage {
  data: unknown;
  type: string;
}

export interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
  message: string;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export interface Ethereum {
  isMetaMask: boolean;

  enable(): Promise<unknown>;

  isConnected(): boolean;

  on(eventName: EthereumEventName.AccountsChanged, handler: (accounts: string[]) => void): void;

  on(eventName: EthereumEventName.ChainChanged, handler: (chainId: string) => void): void;

  on(eventName: EthereumEventName.Connect, handler: (connectInfo: ConnectInfo) => void): void;

  on(eventName: EthereumEventName.Disconnect, handler: (error: ProviderRpcError) => void): void;

  on(eventName: EthereumEventName.Message, handler: (message: ProviderMessage) => void): void;

  request<T = any>(args: RequestArguments): Promise<T>;
}
