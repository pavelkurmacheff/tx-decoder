import {NATIVE_TOKEN_ADDRESS, TOKEN0_POOL_SELECTOR, TOKEN1_POOL_SELECTOR} from '../core/const/common.const';
import {BlockchainRpcCaller} from '../dex/uniswap-v3/model/common.model';
import {BigNumber} from '@ethersproject/bignumber';

const REVERSE_AND_UNWRAP_FLAG = 'c0';
const REVERSE_AND_WRAP_FLAG = 'a0';
const REVERSE_FLAG = '80';
const UNWRAP_FLAG = '40';
const WRAP_FLAG = '20';
const REVERSE_FLAGS = [REVERSE_AND_UNWRAP_FLAG, REVERSE_AND_WRAP_FLAG, REVERSE_FLAG];
const WRAP_FLAGS = [REVERSE_AND_WRAP_FLAG, WRAP_FLAG];
const UNWRAP_FLAGS = [REVERSE_AND_UNWRAP_FLAG, UNWRAP_FLAG];

export function getDestTokenAddressOfUnoSwap(
    poolData: string | BigNumber,
    rpcCaller: BlockchainRpcCaller
): Promise<string> {
    const poolInfo = (
        poolData instanceof BigNumber
            ? poolData.toHexString()
            : poolData.toString()
    ).replace('0x', '');

    const poolFlags = poolInfo.slice(0, 2);
    const isReverseFlag = [REVERSE_AND_UNWRAP_FLAG, REVERSE_FLAG].includes(poolFlags);
    const isUnwrapFlag = [REVERSE_AND_UNWRAP_FLAG, UNWRAP_FLAG].includes(poolFlags);

    if (isUnwrapFlag) {
        return Promise.resolve(NATIVE_TOKEN_ADDRESS);
    }

    const poolAddress = getPoolAddress(poolInfo);

    return requestPoolTokenAddress(poolAddress, isReverseFlag, rpcCaller);
}

export async function getTokensOfUniswapV3Pools(
    pools: string[],
    rpcCaller: BlockchainRpcCaller
): Promise<{ srcTokenAddress: string, dstTokenAddress: string }> {
    const firstPoolInfo = BigInt(pools[0]).toString(16);
    const firstPoolFlags = firstPoolInfo.slice(0, 2);
    const lastPoolInfo = BigInt(pools[pools.length - 1]).toString(16);
    const lastPoolFlags = lastPoolInfo.slice(0, 2);

    const isUnwrapFirstToken = UNWRAP_FLAGS.includes(firstPoolFlags);
    const isWrapLastToken = WRAP_FLAGS.includes(lastPoolFlags);
    const isReverseFirstToken = REVERSE_FLAGS.includes(firstPoolFlags);
    const isReverseLastToken = REVERSE_FLAGS.includes(lastPoolFlags);

    const srcTokenAddress = isUnwrapFirstToken
        ? NATIVE_TOKEN_ADDRESS
        : await requestPoolTokenAddress(getPoolAddress(firstPoolInfo), !isReverseFirstToken, rpcCaller);

    const dstTokenAddress = isWrapLastToken
        ? NATIVE_TOKEN_ADDRESS
        : await requestPoolTokenAddress(getPoolAddress(lastPoolInfo), isReverseLastToken, rpcCaller);

    return { srcTokenAddress, dstTokenAddress };
}

function requestPoolTokenAddress(
    poolAddress: string,
    isReverseFlag: boolean,
    rpcCaller: BlockchainRpcCaller
): Promise<string> {
    const methodSelector = isReverseFlag
        ? TOKEN0_POOL_SELECTOR
        : TOKEN1_POOL_SELECTOR;

    return rpcCaller.call<string>('eth_call', [{
        to: poolAddress,
        data: methodSelector
    }, 'latest']).then(result => {
        return '0x' + result.slice(26);
    });
}

function getPoolAddress(poolInfo: string): string {
    const hasOnlyAddress = poolInfo.length === 40;

    return '0x' + (hasOnlyAddress
        ? poolInfo
        : poolInfo.slice(24));
}
