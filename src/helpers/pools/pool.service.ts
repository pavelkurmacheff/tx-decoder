import {Contract} from 'web3-eth-contract';
import {Web3Service} from '../web3/web3.service';
import {
    NATIVE_TOKEN_ADDRESS,
    TOKEN0_POOL_SELECTOR,
    TOKEN1_POOL_SELECTOR,
} from '../../core/const/common.const';

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

export default class PoolService {
    private contractMap: Map<string, Contract> = new Map();

    constructor(private web3Service: Web3Service) {}

    getDestTokenAddressOfUnoSwap(poolData: string) {
        const poolInfo = poolData.replace('0x', '');

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

    private getContract(address: string, contractAbi: object): Contract {
        let contract = this.contractMap.get(address);
        if (!contract) {
            contract = this.web3Service.getInstance(
                contractAbi,
                address
            ) as Contract;
            this.contractMap.set(address, contract);
        }
        return contract;
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

        return await this.web3Service.web3.eth
            .call(
                {
                    to: this.web3Service.web3.utils.toChecksumAddress(address),
                    data: methodSelector,
                },
                'latest'
            )
            .then((result) => {
                return '0x' + result.slice(26);
            });
    }
}
