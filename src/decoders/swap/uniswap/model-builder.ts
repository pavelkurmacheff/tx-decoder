import { Transaction, Web3Resources } from '../../../model/common.model';
import { PermitTx, SwapTx, TxType, UnwrapTx } from './types';
import { SwapTxDecoded } from '../../../model/swap-tx.model';
import { BigNumber } from '@ethersproject/bignumber';
import { UnwrapTxDecoded } from '../../../model/unwrap-tx.model';
import { MultipleTxsDecoded } from '../../../model/multiple-tx.model';
import { ApproveTxDecoded } from '../../../model/approve-tx.model';
import { ethers } from 'ethers';
import { findTokenByAddress } from '../../../helpers/tokens/tokens.helper';

export async function buildResult(
    resources: Web3Resources,
    txConfig: Transaction,
    data: (SwapTx | UnwrapTx | PermitTx | undefined)[],
    estimatedResult: string
): Promise<MultipleTxsDecoded> {
    const txs: (SwapTxDecoded | UnwrapTxDecoded | ApproveTxDecoded)[] = [];
    for (const tx of data) {
        const index = data.indexOf(tx);
        if (!tx) {
            continue;
        }
        let txDecoded: SwapTxDecoded | UnwrapTxDecoded | ApproveTxDecoded | undefined;
        switch (tx.type) {
            case TxType.SWAP_INPUT:
            case TxType.SWAP_OUTPUT:
                txDecoded = await buildSwapTxDecoded(resources, tx as SwapTx, estimatedResult);
                break;
            case TxType.UNWRAP:
                if (index > 0) {
                    const dstTokenAddress = (data[index - 1] as SwapTx).params.dstTokenAddress;
                    txDecoded = await buildUnwrapTxDecoded(resources, tx as UnwrapTx, estimatedResult, dstTokenAddress);
                }
                break;
            case TxType.PERMIT:
                txDecoded = await buildApproveTxDecoded(resources, tx as PermitTx);
                break;
            default:
                break;
        }
        if (txDecoded) {
            txs.push(txDecoded);
        }
    }

    const result = patch(txConfig, {txs});

    return result;
}

export function patch(txConfig: Transaction, txs: MultipleTxsDecoded): MultipleTxsDecoded {
    console.log(txConfig)
    return txs;
}

export async function buildSwapTxDecoded(
    resources: Web3Resources,
    tx: SwapTx,
    estimatedValue: string
): Promise<SwapTxDecoded | undefined> {
    try {
        let dstToken = findTokenByAddress(resources, tx.params.dstTokenAddress);
        let srcToken = findTokenByAddress(resources, tx.params.srcTokenAddress);

        if (!dstToken) {
            dstToken = await resources.customTokens.getTokenByAddress(tx.params.dstTokenAddress);
        }

        if (!srcToken) {
            srcToken = await resources.customTokens.getTokenByAddress(tx.params.srcTokenAddress);
        }

        if (!srcToken || !dstToken) {
            return undefined;
        }

        if (tx.type === TxType.SWAP_INPUT) {
            // check that user originally send native currency instead of wrapped token
            // if (tx.params.srcAmount && txConfig.value === tx.params.srcAmount.toString()) {
            //     const nativeToken = findTokenByAddress(resources, NATIVE_TOKEN_ADDRESS);
            //     srcToken = nativeToken ? nativeToken : srcToken;
            // }
            const base = {
                dstToken,
                minReturnAmount: BigNumber.from(tx.params.minReturnAmount),
                srcAmount: BigNumber.from(tx.params.srcAmount),
                srcToken,
            }
            return estimatedValue !== '0' ? {...base, dstAmount: BigNumber.from('0x' + estimatedValue)} : base;
        }
        if (tx.type === TxType.SWAP_OUTPUT) {
            // check that user originally send native currency instead of wrapped token
            // if (BigNumber.from(txConfig.value).gte(ethers.constants.Zero)) {
            //     const nativeToken = findTokenByAddress(resources, NATIVE_TOKEN_ADDRESS);
            //     srcToken = nativeToken ? nativeToken : srcToken;
            // }
            const base = {
                dstToken,
                srcToken,
                amountInMaximum: BigNumber.from(tx.params.amountInMaximum),
                dstAmount: BigNumber.from(tx.params.dstAmount),
            }
            return estimatedValue !== '0' ? {...base, srcAmount: BigNumber.from('0x' + estimatedValue)} : base;
        }

        return undefined
    } catch (e) {
        return undefined;
    }
}

export async function buildUnwrapTxDecoded(
    resources: Web3Resources,
    tx: UnwrapTx,
    dstAmountRaw: string,
    dstTokenAddress: string,
): Promise<UnwrapTxDecoded | undefined> {
    try {
        let token = findTokenByAddress(resources, dstTokenAddress);
        if (!token) {
            token = await resources.customTokens.getTokenByAddress(dstTokenAddress);
        }
        if (!token) {
            return undefined;
        }
        const base = {

            minReturnAmount: BigNumber.from(tx.params.minReturnAmount),
            token,
        }
        return dstAmountRaw !== '0' ? {...base, amount: BigNumber.from('0x' + dstAmountRaw)} : base;
    } catch (e) {
        return undefined;
    }
}

export async function buildApproveTxDecoded(
    resources: Web3Resources,
    tx: PermitTx,
): Promise<ApproveTxDecoded | undefined> {
    try {
        let token = findTokenByAddress(resources, tx.params.token);
        if (!token) {
            token = await resources.customTokens.getTokenByAddress(tx.params.token);
        }
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

