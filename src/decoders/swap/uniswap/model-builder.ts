import { BlockchainResources } from '../../../model/common.model';
import { PermitTx, SwapTx, TxType, UnwrapTx } from './types';
import { SwapTxDecoded } from '../../../model/swap-tx.model';
import { findTokenByAddress } from '../../../helpers/tokens.helper';
import { BigNumber } from '@ethersproject/bignumber';
import { UnwrapTxDecoded } from '../../../model/unwrap-tx.model';
import { MultipleTxsDecoded } from '../../../model/multiple-tx.model';

export function buildSwapTxDecoded(
    resources: BlockchainResources,
    tx: SwapTx,
    estimatedValue: string
): SwapTxDecoded | undefined {
    try {
        const dstToken = findTokenByAddress(resources, tx.params.dstTokenAddress);
        const srcToken = findTokenByAddress(resources, tx.params.srcTokenAddress);
        if (!srcToken || !dstToken) {
            return undefined;
        }
        if (tx.type === TxType.SWAP_INPUT) {
            return {
                dstAmount: BigNumber.from('0x' + estimatedValue),
                dstToken,
                minReturnAmount: BigNumber.from(tx.params.minReturnAmount),
                srcAmount: BigNumber.from(tx.params.srcAmount),
                srcToken,
            }
        }
        if (tx.type === TxType.SWAP_OUTPUT) {
            return {
                dstToken,
                srcToken,
                srcAmount: BigNumber.from('0x' + estimatedValue),
                amountInMaximum: BigNumber.from(tx.params.amountInMaximum),
                dstAmount: BigNumber.from(tx.params.dstAmount),

            }
        }

        return undefined
    } catch (e) {
        return undefined;
    }
}

export function buildUnwrapTxDecoded(
    resources: BlockchainResources,
    tx: UnwrapTx,
    dstAmountRaw: string,
    dstTokenAddress: string,
): UnwrapTxDecoded | null {
    try {
        const token = findTokenByAddress(resources, dstTokenAddress);
        if (!token) {
            return null;
        }
        return {
            amount: BigNumber.from('0x' + dstAmountRaw),
            minReturnAmount: BigNumber.from(tx.params.minReturnAmount),
            token,
        }
    } catch (e) {
        return null;
    }
}


export function buildResult(resources: BlockchainResources,
                            data: (SwapTx | UnwrapTx | PermitTx | undefined)[],
                            estimatedResult: string | undefined
): MultipleTxsDecoded {
    const result: MultipleTxsDecoded = {txs: []};

    const swapInTx: SwapTx = data.find(item => item?.type === TxType.SWAP_INPUT) as SwapTx;
    if (swapInTx) {
        const tx = buildSwapTxDecoded(resources, swapInTx, estimatedResult ? estimatedResult : '0');
        if (tx) {
            result.txs.push(tx);
        }
    }

    const swapOutTx: SwapTx = data.find(item => item?.type === TxType.SWAP_OUTPUT) as SwapTx;
    if (swapOutTx) {
        const tx = buildSwapTxDecoded(resources, swapOutTx, estimatedResult ? estimatedResult : '0');
        if (tx) {
            result.txs.push(tx);
        }
    }

    const unwrapTx: UnwrapTx = data.find(item => item?.type === TxType.UNWRAP) as UnwrapTx;
    if (unwrapTx) {
        const tx = buildUnwrapTxDecoded(
            resources,
            unwrapTx,
            estimatedResult ? estimatedResult : '0',
            swapOutTx ? swapOutTx.params.dstTokenAddress: '',
        );
        if (tx) {
            result.txs.push(tx);
        }
    }
    return result;
}
