import {BlockchainResources, BlockchainRpcCaller, DecodeInfo, Transaction} from '../model/common.model';
import {TxDecoder} from './base-tx.decoder';
import {TransactionReceipt} from '@ethersproject/abstract-provider';
import {getDestAmountViaEstimation, getReturnAmountFromLogs} from '../helpers/dest-amount.helper';
import {decodeSwapTx} from '../helpers/swap-decode.helper';
import {BigNumber} from '@ethersproject/bignumber';
import {getDestTokenAddressOfUnoSwap} from '../helpers/uni-pool.helper';
import {SwapTxDecoded} from '../model/swap-tx.model';

export interface UniswapV3PermitTxItemData {
    recipient: string;
    srcToken: string;
    amount: string;
    minReturn: string;
    pools: BigNumber[];
}

export class UniswapV3PermitTxDecoder implements TxDecoder<UniswapV3PermitTxItemData> {
    constructor(readonly resources: BlockchainResources,
                readonly rpcCaller: BlockchainRpcCaller,
                readonly decodeInfo: DecodeInfo,
                readonly txData:UniswapV3PermitTxItemData) {
    }

    async decodeByConfig(txConfig: Transaction): Promise<SwapTxDecoded> {
        const {value: dstAmount, error} = await getDestAmountViaEstimation(this, txConfig);
        const {
            srcToken: srcTokenAddress,
            amount: srcAmount,
            minReturn: minReturnAmount,
            pools
        } = this.txData;

        const dstTokenAddress = await getDestTokenAddressOfUnoSwap(pools[pools.length - 1], this.rpcCaller);

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
            amount: srcAmount,
            minReturn: minReturnAmount,
            pools
        } = this.txData;

        const dstTokenAddress = await getDestTokenAddressOfUnoSwap(
            pools[pools.length - 1],
            this.rpcCaller
        );

        return decodeSwapTx({
            srcTokenAddress,
            dstTokenAddress,
            srcAmount,
            minReturnAmount,
            dstAmount
        }, this.resources);
    }
}
