import {
    ChainTokenByNetwork,
    NATIVE_TOKEN_ADDRESS,
    ZERO_ADDRESS,
} from '../../core/const/common.const';
import {Web3Service} from '../web3/web3.service';
import {ERC20, ERC20_BYTE32, ERC20_UPPER_CASE} from './abi';
import {AbiItem} from 'web3-utils';
import {Token} from '../../core/token';
import {ChainId} from '../../core/chain-id';

export class CustomTokensService {
    constructor(
        private cache: Map<String, Token>,
        private web3Service: Web3Service, 
        readonly chainId: ChainId) {

        const t: Token = ChainTokenByNetwork[this.chainId]
            ? ChainTokenByNetwork[this.chainId]
            : ChainTokenByNetwork[ChainId.Ethereum];

        this.cache.set(ZERO_ADDRESS, t);
        this.cache.set(NATIVE_TOKEN_ADDRESS, t);
    }

    async getTokenByAddress(address: string): Promise<Token | null> {
        try {
            const cachedArrd = this.cache.get(address);
            if (cachedArrd) {
                return cachedArrd;
            }

            const data = await this.fetchTokenInfo(address.toLowerCase());
            if (!data || !data.decimals) {
                return null;
            }

            const info = this.buildMinimizedTokenFromData(data);
            this.cache.set(address, info);

            return info;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    
    private buildMinimizedTokenFromData(data: Token): Token {
        const info: Token = {
            name: data.name,
            symbol: data.symbol,
            address: data.address,
            decimals: data.decimals,
        };

        if (data.logoURI) {
            info.logoURI = data.logoURI;
        }
        return info;
    }

    private async fetchTokenInfo(address: string): Promise<Token | null> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises,no-async-promise-executor
            return new Promise(async (resolve, reject) => {
                try {
                    resolve(await this.fetchNormalTokenInfo(address));
                } catch (e) {
                    if (isUpperCaseToken(e)) {
                        try {
                            resolve(await this.fetchUpperCaseTokenInfo(address));
                        } catch (e) {
                            console.error(e);
                        }
                    } else if (isBytes32TokenInfo(e)) {
                        try {
                            resolve(await this.fetchBytes32TokenInfo(address));
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
                reject('cannot fetch details for token: ' + address);
            });
        } catch (e) {
            return null;
        }
    }

    private async fetchNormalTokenInfo(tokenAddress: string): Promise<Token> {
        const token = new this.web3Service.web3.eth.Contract(
            ERC20 as AbiItem[] | AbiItem,
            tokenAddress
        );

        return {
            symbol: await token.methods.symbol().call(),
            name: await token.methods.name().call(),
            address: tokenAddress,
            decimals: Number(
                (await token.methods.decimals().call()).toString()
            ),
        };
    }

    private async fetchUpperCaseTokenInfo(tokenAddress: string): Promise<Token> {
        const token = new this.web3Service.web3.eth.Contract(
            ERC20_UPPER_CASE as AbiItem[] | AbiItem,
            tokenAddress
        );

        return {
            symbol: await token.methods.SYMBOL().call(),
            name: await token.methods.NAME().call(),
            address: tokenAddress,
            decimals: Number(
                (await token.methods.DECIMALS().call()).toString()
            ),
        };
    }

    private async fetchBytes32TokenInfo(tokenAddress: string): Promise<Token> {
        const token = new this.web3Service.web3.eth.Contract(
            ERC20_BYTE32 as AbiItem[] | AbiItem,
            tokenAddress
        );

        return {
            symbol: this.web3Service.web3.utils.hexToUtf8(
                await token.methods.symbol().call()
            ),
            name: this.web3Service.web3.utils.hexToUtf8(
                await token.methods.name().call()
            ),
            address: tokenAddress,
            decimals: Number(
                (await token.methods.decimals().call()).toString()
            ),
        };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUpperCaseToken(e: any): boolean {
    return e.toString().indexOf('Reverted 0x') !== -1;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBytes32TokenInfo(e: any): boolean {
    return (
        e.toString().indexOf('Number can only safely store up to 53 bits') !==
            -1 || e.toString().indexOf('overflow') !== -1
    );
}

export const isETH = (address: string): boolean => {
    return (
        NATIVE_TOKEN_ADDRESS === address.toLowerCase() ||
        ZERO_ADDRESS === address
    );
};
