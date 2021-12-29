import {BlockchainResources, BlockchainRpcCaller, Transaction} from '../model/common.model';
import {TxDecoder} from './base-tx.decoder';
import {TransactionReceipt} from '@ethersproject/abstract-provider';
import {getDestAmountViaEstimation, getReturnAmountFromLogs} from '../helpers/dest-amount.helper';
import {decodeSwapTx} from '../helpers/swap-decode.helper';
import {SwapTxDecoded} from '../model/swap-tx.model';

export interface ClipperTxItemData {
    srcToken: string;
    dstToken: string;
    amount: string;
    minReturn: string;
}

export class ClipperTxDecoder implements TxDecoder<ClipperTxItemData> {
    constructor(readonly resources: BlockchainResources,
                readonly rpcCaller: BlockchainRpcCaller,
                readonly txData: ClipperTxItemData) {
    }

    async decodeByConfig(txConfig: Transaction): Promise<SwapTxDecoded> {
        const {value: dstAmount, error} = await getDestAmountViaEstimation(this.rpcCaller, txConfig);
        const {
            srcToken: srcTokenAddress,
            dstToken: dstTokenAddress,
            amount: srcAmount,
            minReturn: minReturnAmount
        } = this.txData;

        return decodeSwapTx({
            srcTokenAddress,
            dstTokenAddress,
            srcAmount,
            minReturnAmount,
            dstAmount,
            error
        }, this.resources);
    }

    async decodeByLogs(receipt: TransactionReceipt): Promise<SwapTxDecoded> {
        const dstAmount = getReturnAmountFromLogs(receipt);

        const {
            srcToken: srcTokenAddress,
            dstToken: dstTokenAddress,
            amount: srcAmount,
            minReturn: minReturnAmount
        } = this.txData;

        return decodeSwapTx({
            srcTokenAddress,
            dstTokenAddress,
            srcAmount,
            minReturnAmount,
            dstAmount
        }, this.resources);
    }
}
