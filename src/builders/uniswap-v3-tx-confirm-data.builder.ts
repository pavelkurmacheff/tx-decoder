import { Item } from '../model/tx-ui-items.model';
import {BuilderParams} from '../model/common.model';
import {oneInchRouterV4Swap} from './helpers/1inch-router-v4-swap.helper';
import {findTokenByAddress} from './helpers/tokens.helper';
import {getFirstTokenAddressOfPool, getSecondTokenAddressOfPool} from './helpers/uni-pool.helper';
import {BigNumber} from '@ethersproject/bignumber';

export interface UnoswapV3TxItemData {
    amount: string;
    minReturn: string;
    pools: BigNumber[];
}

export async function uniswapV3TxConfirmDataBuilder(
    params: BuilderParams<UnoswapV3TxItemData>
): Promise<Item[]> {
    const {resources, txConfig, data, rpcCaller} = params;

    const {
        amount: srcAmount,
        minReturn: minReturnAmount,
        pools
    } = data;

    const srcTokenAddress = await getFirstTokenAddressOfPool(pools[0].toString(), rpcCaller);
    const dstTokenAddress = await getSecondTokenAddressOfPool(pools[0].toString(), rpcCaller);

    const srcToken = findTokenByAddress(resources, srcTokenAddress);
    const dstToken = findTokenByAddress(resources, dstTokenAddress);
    const dstAmount = await rpcCaller.call<string>('eth_call', [txConfig])
        .then(response => BigInt(response).toString(10));

    if (!srcToken) {
        throw new Error('Src token is not found for uniswapV3TxConfirmDataBuilder: ' + srcTokenAddress.toLowerCase());
    }

    if (!dstToken) {
        throw new Error('Dst token is not found for uniswapV3TxConfirmDataBuilder: ' + dstTokenAddress.toLowerCase());
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
