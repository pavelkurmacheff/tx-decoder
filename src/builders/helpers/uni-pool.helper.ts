import {TOKEN0_POOL_SELECTOR, TOKEN1_POOL_SELECTOR} from '../../common.const';
import {BlockchainRpcCaller} from '../../model/common.model';

export function getFirstTokenAddressOfPool(
    poolData: string,
    rpcCaller: BlockchainRpcCaller
): Promise<string> {
    const poolInfo = BigInt(poolData).toString(16);
    const poolAddress = poolInfo.length === 42
        ? poolInfo
        : '0x' + poolInfo.slice(24, poolInfo.length);

    return rpcCaller.call<string>('eth_call', [{
        to: poolAddress,
        data: TOKEN0_POOL_SELECTOR
    }]).then(result => '0x' + result.slice(26));
}

export function getSecondTokenAddressOfPool(
    poolData: string,
    rpcCaller: BlockchainRpcCaller
): Promise<string> {
    const poolInfo = BigInt(poolData).toString(16);
    const poolAddress = poolInfo.length === 42
        ? poolInfo
        : '0x' + poolInfo.slice(24, poolInfo.length);

    return rpcCaller.call<string>('eth_call', [{
        to: poolAddress,
        data: TOKEN1_POOL_SELECTOR
    }]).then(result => '0x' + result.slice(26));
}
