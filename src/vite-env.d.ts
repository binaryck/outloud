/**
 * REQUIRED: Enables TypeScript support for Vite features
 *
 * This reference directive provides type definitions for:
 * - CSS/SCSS imports: import "./styles.scss"
 * - Asset imports: import logo from "./logo.png"
 * - Environment variables: import.meta.env.VITE_*
 * - Hot Module Replacement: import.meta.hot
 *
 * Without this, TypeScript will show "Cannot find module" errors
 * for stylesheet and asset imports.
 */
/// <reference types="vite/client" />

// Unisat Wallet API type definitions
declare global {
  interface Window {
    // XVerse Wallet API
    XverseProviders?: {
      BitcoinProvider: {
        request(method: 'sendTransfer', params: {
          recipients: Array<{
            address: string;
            amount: number; // BTC amount (not satoshis)
          }>;
        }): Promise<{
          status: 'success' | 'error';
          result?: {
            txid: string;
          };
          error?: any;
        }>;
        request(method: 'getAccounts', params: any): Promise<any>;
        request(method: string, params: any): Promise<any>;
      };
    };
    
    // Unisat Wallet API
    unisat?: {
      requestAccounts(): Promise<string[]>;
      getAccounts(): Promise<string[]>;
      getNetwork(): Promise<string>;
      switchNetwork(network: string): Promise<void>;
      getChain(): Promise<{ enum: string; name: string; network: string }>;
      switchChain(
        chain: string
      ): Promise<{ enum: string; name: string; network: string }>;
      getPublicKey(): Promise<string>;
      getBalance(): Promise<{
        confirmed: number;
        unconfirmed: number;
        total: number;
      }>;
      getInscriptions(
        cursor: number,
        size: number
      ): Promise<{
        total: number;
        list: Array<{
          inscriptionId: string;
          inscriptionNumber: number;
          address: string;
          outputValue: number;
          content: string;
          contentLength: number;
          contentType: string;
          preview: string;
          timestamp: number;
          offset: number;
          genesisTransaction: string;
          location: string;
        }>;
      }>;
      sendBitcoin(
        toAddress: string,
        satoshis: number,
        options?: {
          feeRate?: number;
          memo?: string;
          memos?: string[];
        }
      ): Promise<string>;
      sendRunes(
        address: string,
        runeid: string,
        amount: string,
        options?: {
          feeRate?: number;
        }
      ): Promise<{ txid: string }>;
      sendInscription(
        address: string,
        inscriptionId: string,
        options?: {
          feeRate?: number;
        }
      ): Promise<{ txid: string }>;
      inscribeTransfer(ticker: string, amount: string): Promise<void>;
      signMessage(
        msg: string,
        type?: "ecdsa" | "bip322-simple"
      ): Promise<string>;
      pushTx(options: { rawtx: string }): Promise<string>;
      signPsbt(
        psbtHex: string,
        options?: {
          autoFinalized?: boolean;
          toSignInputs?: Array<{
            index: number;
            address?: string;
            publicKey?: string;
            sighashTypes?: number[];
            disableTweakSigner?: boolean;
            useTweakedSigner?: boolean;
          }>;
        }
      ): Promise<string>;
      signPsbts(
        psbtHexs: string[],
        options?: Array<{
          autoFinalized?: boolean;
          toSignInputs?: Array<{
            index: number;
            address?: string;
            publicKey?: string;
            sighashTypes?: number[];
            useTweakedSigner?: boolean;
          }>;
        }>
      ): Promise<string[]>;
      pushPsbt(psbtHex: string): Promise<string>;
      on(event: "accountsChanged", handler: (accounts: string[]) => void): void;
      on(event: "networkChanged", handler: (network: string) => void): void;
      removeListener(
        event: "accountsChanged",
        handler: (accounts: string[]) => void
      ): void;
      removeListener(
        event: "networkChanged",
        handler: (network: string) => void
      ): void;
    };
  }
}

export {};
