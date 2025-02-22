import {BigNumber} from '@ethersproject/bignumber';
import {Interface} from '@ethersproject/abi';

export interface Transaction {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: BigNumber;
    gasLimit: BigNumber;
    nonce?: number;
}

export interface Token {
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    logoURI: string;
}

export interface BlockchainResources {
    readonly tokens: {[key: string]: Token}, // https://tokens.1inch.io/v1.1/1
    readonly tokenPrices: {[key: string]: string}, // https://token-prices.1inch.io/v1.1/1
}

export interface BlockchainRpcCaller {
    call<T>(method: string, params: unknown[]): Promise<T>;
}

export interface DecodeInfo {
    iface: Interface;
    methodSelector: string;
}
