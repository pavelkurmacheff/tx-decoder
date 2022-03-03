import {
    BlockchainResources,
    Web3Resources,
} from '../../dex/uniswap-v3/model/common.model';
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from '../../core/const/common.const';
import { Token } from 'src/core/token';

export function findTokenByAddress(resources: BlockchainResources, tokenAddress: string): Token | null {
    const address =
        tokenAddress === ZERO_ADDRESS
            ? NATIVE_TOKEN_ADDRESS
            : tokenAddress.toLowerCase();

    return resources.tokens[address] || null;
}

export async function tryToFindTokenByAddress(resources: Web3Resources, tokenAddress: string): Promise<Token | null> {
    let token = findTokenByAddress(resources, tokenAddress);
    if (!token) {
        token = await resources.customTokens.getTokenByAddress(tokenAddress);
    }
    return token || null;
}
