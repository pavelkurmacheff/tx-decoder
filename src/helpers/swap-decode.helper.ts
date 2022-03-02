import {BigNumber} from '@ethersproject/bignumber';
import {BlockchainResources} from '../dex/uniswap-v3/model/common.model';
import {
    SwapTxDecoded,
    SwapTxDecodeInput,
} from '../dex/uniswap-v3/model/swap-tx.model';
import {findTokenByAddress} from './tokens/tokens.helper';

export function decodeSwapTx(
    input: SwapTxDecodeInput,
    resources: BlockchainResources
): SwapTxDecoded {
    const {
        srcTokenAddress,
        dstTokenAddress,
        srcAmount,
        minReturnAmount,
        dstAmount,
        error,
    } = input;

    const srcToken = findTokenByAddress(resources, srcTokenAddress);
    const dstToken = findTokenByAddress(resources, dstTokenAddress);

    if (!srcToken) {
        throw new Error(
            'Src token is not found for swapTxConfirmDataBuilder: ' +
                srcTokenAddress
        );
    }

    if (!dstToken) {
        throw new Error(
            'Dst token is not found for swapTxConfirmDataBuilder: ' +
                dstTokenAddress
        );
    }

    return {
        srcToken,
        dstToken,
        dstAmount,
        srcAmount: BigNumber.from(srcAmount),
        minReturnAmount: BigNumber.from(minReturnAmount),
        error,
    };
}
