import {BlockchainResources, BlockchainRpcCaller, DecodeInfo, Transaction} from '../model/common.model';
import {TxDecoder} from './base-tx.decoder';
import {TransactionReceipt} from '@ethersproject/abstract-provider';
import {getDestAmountViaEstimation, getReturnAmountFromLogs} from '../helpers/dest-amount.helper';
import {decodeSwapTx} from '../helpers/swap-decode.helper';
import {SwapTxDecoded} from '../model/swap-tx.model';

export interface SwapTxItemData {
    desc: {
        srcToken: string,
        dstToken: string,
        amount: string,
        minReturnAmount: string,
    }
}

export class SwapTxDecoder implements TxDecoder<SwapTxItemData> {
    constructor(readonly resources: BlockchainResources,
                readonly rpcCaller: BlockchainRpcCaller,
                readonly decodeInfo: DecodeInfo,
                readonly txData: SwapTxItemData) {
    }

    async decodeByConfig(txConfig: Transaction): Promise<SwapTxDecoded> {
        const {value: dstAmount, error} = await getDestAmountViaEstimation(this, txConfig);
        const {
            srcToken: srcTokenAddress,
            dstToken: dstTokenAddress,
            amount: srcAmount,
            minReturnAmount
        } = this.txData.desc;

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
            minReturnAmount
        } = this.txData.desc;

        return decodeSwapTx({
            srcTokenAddress,
            dstTokenAddress,
            srcAmount,
            minReturnAmount,
            dstAmount
        }, this.resources);
    }
}
