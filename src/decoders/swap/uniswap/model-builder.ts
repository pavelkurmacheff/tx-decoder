import { BlockchainResources } from '../../../model/common.model';
import { PermitTx, SwapTx, TxType, UnwrapTx } from './types';
import { SwapTxDecoded } from '../../../model/swap-tx.model';
import { findTokenByAddress } from '../../../helpers/tokens.helper';
import { BigNumber } from '@ethersproject/bignumber';
import { UnwrapTxDecoded } from '../../../model/unwrap-tx.model';
import { MultipleTxsDecoded } from '../../../model/multiple-tx.model';
import { ApproveTxDecoded } from '../../../model/approve-tx.model';
import { ethers } from 'ethers';

export function buildResult(
    resources: BlockchainResources,
    data: (SwapTx | UnwrapTx | PermitTx | undefined)[],
    estimatedResult: string
): MultipleTxsDecoded {
    const txs: (SwapTxDecoded | UnwrapTxDecoded | ApproveTxDecoded)[] = [];
    data.forEach((tx, index) => {
        if (!tx) {
            return;
        }
        let txDecoded: SwapTxDecoded | UnwrapTxDecoded | ApproveTxDecoded | undefined;
        switch (tx.type) {
            case TxType.SWAP_INPUT:
            case TxType.SWAP_OUTPUT:
                txDecoded = buildSwapTxDecoded(resources, tx as SwapTx, estimatedResult);
                break;
            case TxType.UNWRAP:
                if (index > 0) {
                    const dstTokenAddress = (data[index - 1] as SwapTx).params.dstTokenAddress;
                    txDecoded = buildUnwrapTxDecoded(resources, tx as UnwrapTx, estimatedResult, dstTokenAddress);
                }
                break;
            case TxType.PERMIT:
                txDecoded = buildApproveTxDecoded(resources,  tx as PermitTx);
                break;
            default:
                break;
        }
        if (txDecoded) {
            txs.push(txDecoded);
        }
        return;
    })

    return {txs};
}

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
): UnwrapTxDecoded | undefined {
    try {
        const token = findTokenByAddress(resources, dstTokenAddress);
        if (!token) {
            return undefined;
        }
        return {
            amount: BigNumber.from('0x' + dstAmountRaw),
            minReturnAmount: BigNumber.from(tx.params.minReturnAmount),
            token,
        }
    } catch (e) {
        return undefined;
    }
}

export function buildApproveTxDecoded(
    resources: BlockchainResources,
    tx: PermitTx,
): ApproveTxDecoded | undefined {
    try {
        const token = findTokenByAddress(resources, tx.params.token);
        if (!token) {
            return undefined;
        }
        return {
            value: ethers.constants.MaxUint256,
            token,
            time: tx.params.expiry.toNumber(),
        }
    } catch (e) {
        return undefined;
    }
}

