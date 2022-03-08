import {
    NATIVE_TOKEN_ADDRESS,
    TOKEN0_POOL_SELECTOR,
    TOKEN1_POOL_SELECTOR,
} from '../../../core/const/common.const';
import {Web3Service} from '../../../helpers/web3/web3.service';

const REVERSE_AND_UNWRAP_FLAG = 'c0';
const REVERSE_AND_WRAP_FLAG = 'a0';
const REVERSE_FLAG = '80';
const UNWRAP_FLAG = '40';
const WRAP_FLAG = '20';

const REVERSE_FLAGS = [
    REVERSE_AND_UNWRAP_FLAG,
    REVERSE_AND_WRAP_FLAG,
    REVERSE_FLAG,
];
const WRAP_FLAGS = [REVERSE_AND_WRAP_FLAG, WRAP_FLAG];
const UNWRAP_FLAGS = [REVERSE_AND_UNWRAP_FLAG, UNWRAP_FLAG];

// This is black magic, bro
export default class PoolService {
    constructor(private web3Service: Web3Service) {}

    // 1inch unoswap
    async getDestTokenAddress(poolData: string): Promise<string> {
        const poolInfo = BigInt(poolData).toString(16);
        const poolFlags = poolInfo.slice(0, 2);
        const isReverseFlag = [REVERSE_AND_UNWRAP_FLAG, REVERSE_FLAG].includes(
            poolFlags
        );
        const isUnwrapFlag = [REVERSE_AND_UNWRAP_FLAG, UNWRAP_FLAG].includes(
            poolFlags
        );
        if (isUnwrapFlag) {
            return Promise.resolve(NATIVE_TOKEN_ADDRESS);
        }
        const poolAddress = this.getPoolAddress(poolInfo);
        return this.requestTokenAddress(poolAddress, isReverseFlag);
    }

    // 1inch uniswapV3Swap
    async getBothTokenAddress(pools: string[]): Promise<string[]> {
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
            : await this.requestTokenAddress(
                  this.getPoolAddress(firstPoolInfo),
                  !isReverseFirstToken
              );

        const dstTokenAddress = isWrapLastToken
            ? NATIVE_TOKEN_ADDRESS
            : await this.requestTokenAddress(
                  this.getPoolAddress(lastPoolInfo),
                  isReverseLastToken
              );

        return [srcTokenAddress, dstTokenAddress];
    }

    private getPoolAddress(poolInfo: string): string {
        const hasOnlyAddress = poolInfo.length === 40;
        return '0x' + (hasOnlyAddress ? poolInfo : poolInfo.slice(24));
    }

    private async requestTokenAddress(
        address: string,
        isReverseFlag: boolean
    ): Promise<string> {
        const methodSelector = isReverseFlag
            ? TOKEN0_POOL_SELECTOR
            : TOKEN1_POOL_SELECTOR;

        const data = {
            to: this.web3Service.web3.utils.toChecksumAddress(address),
            data: methodSelector,
        };

        return await this.web3Service.web3.eth
            .call(data, 'latest')
            .then((result) => '0x' + result.slice(26));
    }
}
