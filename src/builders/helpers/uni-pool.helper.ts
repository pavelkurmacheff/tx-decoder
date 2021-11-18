import {TOKEN0_POOL_SELECTOR, TOKEN1_POOL_SELECTOR} from '../../common.const';
import {BlockchainRpcCaller} from '../../model/common.model';

const REVERSE_AND_WRAP_FLAG = 'c0';
const REVERSE_AND_UNWRAP_FLAG = 'a0';
const REVERSE_FLAG = '80';
const WRAP_FLAG = '40';
const UNWRAP_FLAG = '20';

export function getTokenAddressOfUniPool(
    poolData: string,
    rpcCaller: BlockchainRpcCaller
): Promise<string> {
    const poolInfo = BigInt(poolData).toString(16);
    const poolFlags = poolInfo.slice(0, 2);

    const isReverseFlag = [
        REVERSE_AND_UNWRAP_FLAG,
        REVERSE_AND_WRAP_FLAG,
        REVERSE_FLAG
    ].includes(poolFlags);

    const isUnwrapFlag = [
        REVERSE_AND_UNWRAP_FLAG,
        UNWRAP_FLAG,
        REVERSE_AND_WRAP_FLAG,
        WRAP_FLAG
    ].includes(poolFlags);

    if (isUnwrapFlag) {
        return Promise.resolve('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    }

    const hasOnlyAddress = poolInfo.length === 42;
    const poolAddress = hasOnlyAddress
        ? poolInfo
        : '0x' + poolInfo.slice(24, 40);

    const methodSelector = isReverseFlag
        ? TOKEN0_POOL_SELECTOR
        : TOKEN1_POOL_SELECTOR;

    return rpcCaller.call<string>('eth_call', [{
        to: poolAddress,
        data: methodSelector
    }]).then(result => '0x' + result.slice(26));
}

export function getSourceTokenAddressOfUniPool(
    poolData: string,
    rpcCaller: BlockchainRpcCaller
): Promise<string> {
    const poolInfo = BigInt(poolData).toString(16);

    const hasOnlyAddress = poolInfo.length === 42;
    const poolAddress = hasOnlyAddress
        ? poolInfo
        : '0x' + poolInfo.slice(24, 40);

    return rpcCaller.call<string>('eth_call', [{
        to: poolAddress,
        data: TOKEN0_POOL_SELECTOR
    }]).then(result => '0x' + result.slice(26));
}
