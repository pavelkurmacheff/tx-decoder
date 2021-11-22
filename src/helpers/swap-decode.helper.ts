import {findTokenByAddress} from './tokens.helper';
import {BigNumber} from '@ethersproject/bignumber';
import {BlockchainResources} from '../model/common.model';
import {SwapTxDecoded, SwapTxDecodeInput} from '../model/swap-tx.model';

export function decodeSwapTx(input: SwapTxDecodeInput, resources: BlockchainResources): SwapTxDecoded {
    const {
        srcTokenAddress, dstTokenAddress, srcAmount, minReturnAmount, dstAmount
    } = input;

    const srcToken = findTokenByAddress(resources, srcTokenAddress);
    const dstToken = findTokenByAddress(resources, dstTokenAddress);

    if (!srcToken) {
        throw new Error('Src token is not found for swapTxConfirmDataBuilder: ' + srcTokenAddress);
    }

    if (!dstToken) {
        throw new Error('Dst token is not found for swapTxConfirmDataBuilder: ' + dstTokenAddress);
    }

    return {
        srcToken, dstToken, dstAmount,
        srcAmount: BigNumber.from(srcAmount),
        minReturnAmount: BigNumber.from(minReturnAmount)
    }
}
