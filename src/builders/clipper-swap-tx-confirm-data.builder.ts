import { Item } from '../model/tx-ui-items.model';
import {BuilderParams} from '../model/common.model';
import {oneInchRouterV4Swap} from './helpers/1inch-router-v4-swap.helper';
import {findTokenByAddress} from './helpers/tokens.helper';

export interface ClipperSwapTxItemData {
    srcToken: string;
    dstToken: string;
    amount: string;
    minReturn: string;
}

export async function clipperSwapTxConfirmDataBuilder(
    params: BuilderParams<ClipperSwapTxItemData>
): Promise<Item[]> {
    const {resources, txConfig, data, rpcCaller} = params;

    const {
        srcToken: srcTokenAddress,
        dstToken: dstTokenAddress,
        amount: srcAmount,
        minReturn: minReturnAmount
    } = data;

    const srcToken = findTokenByAddress(resources, srcTokenAddress);
    const dstToken = findTokenByAddress(resources, dstTokenAddress);
    const dstAmount = await rpcCaller.call<string>('eth_call', [txConfig])
        .then(response => BigInt(response).toString(10));

    if (!srcToken) {
        throw new Error('Src token is not found for clipperSwapTxConfirmDataBuilder: ' + srcTokenAddress);
    }

    if (!dstToken) {
        throw new Error('Dst token is not found for clipperSwapTxConfirmDataBuilder: ' + dstTokenAddress);
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
