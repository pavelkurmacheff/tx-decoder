import {NATIVE_TOKEN_ADDRESS, TOKEN0_POOL_SELECTOR, TOKEN1_POOL_SELECTOR} from '../../common.const';
import {BlockchainRpcCaller} from '../../model/common.model';

const REVERSE_AND_UNWRAP_FLAG = 'c0';
const REVERSE_AND_WRAP_FLAG = 'a0';
const REVERSE_FLAG = '80';
const UNWRAP_FLAG = '40';
const WRAP_FLAG = '20';

export function getDestTokenAddressOfUnoSwap(
    poolData: string,
    rpcCaller: BlockchainRpcCaller
): Promise<string> {
    const poolInfo = BigInt(poolData).toString(16);
    const poolFlags = poolInfo.slice(0, 2);

    const isReverseFlag = [
        REVERSE_AND_UNWRAP_FLAG,
        REVERSE_FLAG
    ].includes(poolFlags);

    const isUnwrapFlag = [
        REVERSE_AND_UNWRAP_FLAG,
        UNWRAP_FLAG,
    ].includes(poolFlags);

    if (isUnwrapFlag) {
        return Promise.resolve(NATIVE_TOKEN_ADDRESS);
    }

    const poolAddress = getPoolAddress(poolInfo);

    return requestPoolTokenAddress(poolAddress, isReverseFlag, rpcCaller);
}

export async function getTokensOfUniswapV3Pools(
    pools: string[],
    rpcCaller: BlockchainRpcCaller
): Promise<{srcTokenAddress: string, dstTokenAddress: string}> {
    const firstPoolInfo = BigInt(pools[0]).toString(16);
    const firstPoolFlags = firstPoolInfo.slice(0, 2);

    const lastPoolInfo = BigInt(pools[pools.length - 1]).toString(16);
    const lastPoolFlags = lastPoolInfo.slice(0, 2);

    const isUnwrapFirstToken = [REVERSE_AND_UNWRAP_FLAG, UNWRAP_FLAG].includes(firstPoolFlags);
    const isWrapLastToken = [REVERSE_AND_WRAP_FLAG, WRAP_FLAG].includes(lastPoolFlags);

    const isReverseFirstToken = firstPoolFlags === REVERSE_FLAG;
    const isReverseLastToken = lastPoolFlags === REVERSE_FLAG;

    const srcTokenAddress = isUnwrapFirstToken
        ? NATIVE_TOKEN_ADDRESS
        : await requestPoolTokenAddress(getPoolAddress(firstPoolInfo), !isReverseFirstToken, rpcCaller);

    const dstTokenAddress = isWrapLastToken
        ? NATIVE_TOKEN_ADDRESS
        : await requestPoolTokenAddress(getPoolAddress(lastPoolFlags), isReverseLastToken, rpcCaller);

    return {srcTokenAddress, dstTokenAddress};
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
    }]).then(result => '0x' + result.slice(26));
}

function getPoolAddress(poolInfo: string): string {
    const hasOnlyAddress = poolInfo.length === 42;

    return hasOnlyAddress
        ? poolInfo
        : '0x' + poolInfo.slice(24, 40);
}
