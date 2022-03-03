import { Token } from "src/core/transaction-rich/token";

/**** Keys ****/
export type ItemTokenKey = {
    type: 'token',
    value: {
        token: Token,
        type: 'from'
            | 'to'
            | 'amount'
            | 'reward'
            | 'stake'
            | 'unstake'
            | 'value'
            | 'earnedReward'
            | 'depositAmount'
            | 'minimalReturn'
            | 'aggregationProtocolVote'
    }
};

export type ItemIconKey = {
    type: 'icon',
    value: {
        icon: 'toWallet'
            | 'fromWallet'
            | 'hash'
            | 'nonce'
            | 'spender'
            | 'contract'
            | 'rawData'
    }
};

export type ItemTokenPairKey = {
    type: 'tokenPair',
    value: {
        token1: Token;
        token2: Token;
        // '1lp': title "1LP-token1.symbol-token2.symbol"
        // 'generic': title "Liquidity Pool"
        type: '1lp'
            | 'generic'
    }
};

export type ItemTitleKey = {
    type: 'title',
    value: {
        title: string // 'Sell Price' | 'Buy Price' | 'Minimum Received' | '<voting parameter name>'
    }
};

export type ItemWalletKey = {
    type: 'wallet',
    value: {
        type: 'from' | 'to' | 'own'
    }
};

export type ItemPlaceholderKey = {
    type: 'placeholder'
};

export type Key = ItemTokenKey
    | ItemIconKey
    | ItemTokenPairKey
    | ItemTitleKey
    | ItemWalletKey
    | ItemPlaceholderKey;


/**** Values ****/

export type ItemAmountValue = {
    type: 'amount',
    value: {
        token: Token,
        value: string, // BigInt
        sign: '+' | '-' | '0'
    }
};

export type ItemTitleSubtitleValue = {
    type: 'titleSubtitle',
    value: {
        title: string,
        subtitle: string
    }
};

export type ItemTextValue = {
    type: 'text',
    value: {
        text: string,
        type: 'plain' | 'address' | 'txHash' | 'rawData'
    }
};

export type ItemRateValue = {
    type: 'rate',
    value: {
        sourceToken: Token,
        sourceAmount: string, // BigInt
        destinationToken: Token,
        destinationAmount: string // BigInt
    }
};

export type ItemLocalizableValue = {
    type: 'localizable',
    value: {
        format: string, // example: 'Please approve swap %%0%% for %%1%%'
        args: string[] // example: ['ETH', '1INCH']
    }
};

export type ItemPlaceholderValue = {
    type: 'placeholder',
    value: {
        type: 'fee'
    }
};

export type Value = ItemAmountValue
    | ItemTitleSubtitleValue
    | ItemTextValue
    | ItemRateValue
    | ItemLocalizableValue
    | ItemPlaceholderValue;


/**** Item ****/

export interface Item {
    key: Key;
    value?: Value;
}

export type TxType = 'swap'
    | 'clipperSwap'
    | 'clipperSwapWithPermit'
    | 'unoswap'
    | 'unoswapWithPermit'
    | 'uniswapV3Swap'
    | 'uniswapV3SwapToWithPermit'
    | 'approve';