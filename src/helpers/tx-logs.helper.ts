import {BlockchainRpcCaller} from '../model/common.model';
import {TransactionReceipt, TransactionResponse} from '@ethersproject/abstract-provider';

type TransactionResponseFixed = TransactionResponse & {input: string, gas: string, value: string};

export function getTxReceipt(rpcCaller: BlockchainRpcCaller, txHash: string): Promise<TransactionReceipt> {
    return rpcCaller.call<TransactionReceipt>('eth_getTransactionReceipt', [txHash]);
}

export function getTxByHash(
    rpcCaller: BlockchainRpcCaller,
    txHash: string
): Promise<TransactionResponseFixed> {
    return rpcCaller.call<TransactionResponseFixed>('eth_getTransactionByHash', [txHash]);
}

