export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export enum NetworkEnum {
    ETHEREUM = 1,
    ROPSTEN = 3, // Ethereum testnet.
    KOVAN = 45,
    OPTIMISM_KOVAN = 69,
    POLYGON = 137,
    MUMBAI = 80001, // Polygon testnet.
    OPTIMISM = 10,
    BINANCE = 56,
    ARBITRUM = 42161,
    AVALANCHE = 43114,
    GNOSIS_CHAIN = 100
}

export const TOKEN0_POOL_SELECTOR = '0x0dfe1681';
export const TOKEN1_POOL_SELECTOR = '0xd21220a7';

export const ChainTokenByNetwork = {
    1: {
        symbol: 'ETH',
        name: 'Ethereum',
        address: NATIVE_TOKEN_ADDRESS,
        decimals: 18,
        logoURI:
            'https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
    },
    56: {
        symbol: 'BNB',
        name: 'BNB',
        decimals: 18,
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        logoURI: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_1.png'
    },
    137: {
        symbol: 'MATIC',
        name: 'MATIC',
        decimals: 18,
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        logoURI: 'https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png'
    }
}
