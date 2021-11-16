import {BlockchainResources, Token} from '../../model/common.model';
import {NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS} from '../../common.const';

export function findTokenByAddress(resources: BlockchainResources, tokenAddress: string): Token | null {
    const address = tokenAddress === ZERO_ADDRESS
        ? NATIVE_TOKEN_ADDRESS
        : tokenAddress.toLowerCase();

    return resources.tokens[address] || null;
}
