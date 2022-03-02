export interface Token {
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    logoURI?: string;
}

export function createUnknownToken(address: string): Token {
    return {
        address,
        name: 'Unknown',
        symbol: 'UNKNOWN',
        decimals: 1,
    };
}