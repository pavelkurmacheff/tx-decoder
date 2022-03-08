import { Token } from "../core/token";
import { ChainId } from "../core/chain-id";
import fetch from 'isomorphic-unfetch';

type TokenMap = {[tokenAddress: string]: Token};

export function loadTokens(chainId: ChainId): Promise<TokenMap> {
    return fetch('https://tokens.1inch.io/v1.1/' + chainId)
        .then((r: Response) => r.json());
}

export function loadTokensMap(chainId: ChainId): Promise<Map<string, Token>> {
    return fetch('https://tokens.1inch.io/v1.1/' + chainId)
        .then((r: Response) => r.json())
        .then(d => {
            const entries = Object.entries(d) as [string, Token][];
            return new Map(entries);
        });
}

type TokenPriceMap = {[tokenAddress: string]: string};

export function loadTokensPrice(chainId: ChainId): Promise<TokenPriceMap> {
    return fetch('https://token-prices.1inch.io/v1.1/' + chainId)
        .then((r: Response) => r.json());
}

export function loadTokensPriceMap(chainId: ChainId): Promise<Map<string, string>> {
    return fetch('https://token-prices.1inch.io/v1.1/' + chainId)
        .then((r: Response) => r.json())
        .then(d => {
            const entries = Object.entries(d) as [string, string][];
            return new Map(entries);
        });
}
