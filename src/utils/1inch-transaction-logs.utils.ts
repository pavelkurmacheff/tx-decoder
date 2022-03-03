import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';
import fetch from 'isomorphic-unfetch';

const nodeUrl = 'https://web3-node-private.1inch.exchange/';

function callRpc<T>(method: string, params: unknown[]): Promise<T> {
    return fetch(nodeUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'referer': 'http://localhost:4200/',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
        },
        body: JSON.stringify({
            method,
            params,
            jsonrpc: '2.0',
            id: Date.now()
        })
    })
        .then((res: { json: () => any; }) => {
            return res.json();
        })
        .then((res: { result: T; }) => {
            return res.result as T;
        });
}


type TransactionResponseFixed = TransactionResponse & {input: string, gas: string, value: string};

export function getTransactionByHash(txHash: string): Promise<TransactionResponseFixed> {
    return callRpc<TransactionResponseFixed>('eth_getTransactionByHash', [txHash]);
}

export function getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
    return callRpc<TransactionReceipt>('eth_getTransactionReceipt', [txHash]);
}