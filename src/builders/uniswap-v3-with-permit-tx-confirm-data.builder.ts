import { Item } from '../model/tx-ui-items.model';
import {BuilderParams} from '../model/common.model';
import {oneInchRouterV4Swap} from './helpers/1inch-router-v4-swap.helper';
import {findTokenByAddress} from './helpers/tokens.helper';
import {BigNumber} from '@ethersproject/bignumber';
import {getDestTokenAddressOfUnoSwap} from './helpers/uni-pool.helper';

export interface UniswapV3WithPermitTxItemData {
    recipient: string;
    srcToken: string;
    amount: string;
    minReturn: string;
    pools: BigNumber[];
}

export async function uniswapV3WithPermitTxConfirmDataBuilder(
    params: BuilderParams<UniswapV3WithPermitTxItemData>
): Promise<Item[]> {
    const {resources, txConfig, data, rpcCaller} = params;

    const {
        srcToken: srcTokenAddress,
        amount: srcAmount,
        minReturn: minReturnAmount,
        pools
    } = data;

    const dstTokenAddress = await getDestTokenAddressOfUnoSwap(
        pools[pools.length - 1].toString(),
        rpcCaller
    );
    const srcToken = findTokenByAddress(resources, srcTokenAddress);
    const dstToken = findTokenByAddress(resources, dstTokenAddress);
    const dstAmount = await rpcCaller.call<string>('eth_call', [txConfig])
        .then(response => BigInt(response).toString(10));

    if (!srcToken) {
        throw new Error('Src token is not found for uniswapV3TxConfirmDataBuilder: ' + srcTokenAddress);
    }

    if (!dstToken) {
        throw new Error('Dst token is not found for uniswapV3TxConfirmDataBuilder: ' + dstTokenAddress);
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
