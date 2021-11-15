export interface Transaction {
    from: string;
    to: string;
    value: string;
    data: string;
    gasPrice: string | number;
    gasLimit: string | number;
    nonce?: string | number;
}

export interface Token {
    address: string;
    name: string;
    decimals: number;
    symbol: string;
}

export interface BlockchainResources {
    readonly tokens: {[key: string]: Token}, // https://tokens.1inch.io/v1.1/1
    readonly tokenPrices: {[key: string]: string}, // https://token-prices.1inch.io/v1.1/1
}
