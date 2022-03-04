import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import fetch from 'isomorphic-unfetch';
import { TransactionRaw } from 'src/core/transaction-raw';

const nodeUrl = 'https://web3-node-private.1inch.exchange/';

interface RpcError {
    code: number,
    data: string,
    message: string,
}
type RpcResponse<T> = { tag: 'Success', data: T }| { tag: 'Error', error: RpcError }

// https://eth.wiki/json-rpc/API
function callRpc<T>(method: string, params: unknown[]): Promise<RpcResponse<T>> {
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
        .then((r: Response) => r.json())
        .then((r: any) => {
            console.log(r);
            if (r.error) {
                // https://eth.wiki/json-rpc/json-rpc-error-codes-improvement-proposal
                return { tag: 'Error', error: r.error };
            } else {
                return { tag: 'Success', data: r.result as T }
            }
        });
}

export type TransactionResponseFixed = TransactionResponse & {input: string, gas: string, value: string};

export async function getTransactionByHash(txHash: string): Promise<TransactionResponseFixed> {
    const r = await callRpc<TransactionResponseFixed>('eth_getTransactionByHash', [txHash]);
    switch(r.tag) {
        case 'Error':
            throw r.error;
        case 'Success':
            return r.data;
    }
}

export async function getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
    const r = await callRpc<TransactionReceipt>('eth_getTransactionReceipt', [txHash]);
    switch(r.tag) {
        case 'Error':
            throw r.error;
        case 'Success':
            return r.data;
    }
}

export async function runTransaction(tx: TransactionRaw, abi: any): Promise<any> {
    const { from, to, value, data } = tx;
    const request = {
        from, 
        to, data,
        value: ['0', '0x', '0x0', '0x00'].includes(value)
            ? '0x0'
            : BigNumber.from(value).toHexString(),
    };

    // https://eth.wiki/json-rpc/API#eth_call
    const r = await callRpc<any>('eth_call', [request, 'latest']);
    if (r.tag == 'Error') {
        throw r.error;
    }

    const iface = new Interface(abi);
    const methodSelector = tx.data.slice(0, 10).toLowerCase();
    const res = iface.decodeFunctionResult(methodSelector, r.data);
    return res;
}