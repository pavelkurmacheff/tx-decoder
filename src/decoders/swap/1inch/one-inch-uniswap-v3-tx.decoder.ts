import {BlockchainResources, BlockchainRpcCaller, DecodeInfo, Transaction} from '../../../model/common.model';
import {TxDecoder} from '../../base-tx.decoder';
import {TransactionReceipt} from '@ethersproject/abstract-provider';
import {getDestAmountViaEstimation, getReturnAmountFromLogs} from '../../../helpers/dest-amount.helper';
import {decodeSwapTx} from '../../../helpers/swap-decode.helper';
import {BigNumber} from '@ethersproject/bignumber';
import {getTokensOfUniswapV3Pools} from '../../../helpers/uni-pool.helper';
import {SwapTxDecoded} from '../../../model/swap-tx.model';
import { NetworkEnum } from '../../../const/common.const';

export interface UniswapV3TxItemData {
    amount: string;
    minReturn: string;
    pools: BigNumber[];
}

export class OneInchUniswapV3TxDecoder implements TxDecoder<UniswapV3TxItemData> {
    constructor(readonly resources: BlockchainResources,
                readonly rpcCaller: BlockchainRpcCaller,
                readonly decodeInfo: DecodeInfo,
                readonly txData: UniswapV3TxItemData,
                readonly chainId: NetworkEnum) {
    }

    async decodeByConfig(txConfig: Transaction): Promise<SwapTxDecoded> {
        const {value: dstAmount, error} = await getDestAmountViaEstimation(this, txConfig);
        const {
            amount: srcAmount,
            minReturn: minReturnAmount,
            pools
        } = this.txData;

        const { srcTokenAddress, dstTokenAddress } = await getTokensOfUniswapV3Pools(
            pools.map(pool => pool.toString()),
            this.rpcCaller
        );

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
            amount: srcAmount,
            minReturn: minReturnAmount,
            pools
        } = this.txData;

        const {
            srcTokenAddress,
            dstTokenAddress
        } = await getTokensOfUniswapV3Pools(
            pools.map(pool => pool.toString()),
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
