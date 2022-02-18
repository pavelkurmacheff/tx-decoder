import { BlockchainResources } from '../../../model/common.model';
import { SwapTx, TxType, UnwrapTx } from './types';
import { SwapTxDecoded } from '../../../model/swap-tx.model';
import { findTokenByAddress } from '../../../helpers/tokens.helper';
import { BigNumber } from '@ethersproject/bignumber';
import { UnwrapTxDecoded } from '../../../model/unwrap-tx.model';

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
