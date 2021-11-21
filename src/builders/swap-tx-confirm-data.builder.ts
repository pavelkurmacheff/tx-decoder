import { Item } from '../model/tx-ui-items.model';
import {BuilderParams} from '../model/common.model';
import {oneInchRouterV4Swap} from './helpers/1inch-router-v4-swap.helper';
import {findTokenByAddress} from './helpers/tokens.helper';
import {getDestAmountViaEstimation} from './helpers/dest-amount.helper';

export interface SwapTxItemData {
    desc: {
        srcToken: string,
        dstToken: string,
        amount: string,
        minReturnAmount: string,
    }
}

export async function swapTxConfirmDataBuilder(
    params: BuilderParams<SwapTxItemData>
): Promise<Item[]> {
    const {resources, txConfig, data} = params;

    const {
        srcToken: srcTokenAddress,
        dstToken: dstTokenAddress,
        amount: srcAmount,
        minReturnAmount
    } = data.desc;

    const srcToken = findTokenByAddress(resources, srcTokenAddress);
    const dstToken = findTokenByAddress(resources, dstTokenAddress);
    const dstAmount = await getDestAmountViaEstimation(params);

    if (!srcToken) {
        throw new Error('Src token is not found for swapTxConfirmDataBuilder: ' + data.desc.srcToken);
    }

    if (!dstToken) {
        throw new Error('Dst token is not found for swapTxConfirmDataBuilder: ' + data.desc.dstToken);
    }

    return oneInchRouterV4Swap({
        srcToken,
        srcAmount,
        dstToken,
        dstAmount,
        minReturnAmount,
        from: txConfig.from.toLowerCase()
    });
}
