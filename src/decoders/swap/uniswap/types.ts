import { BigNumber } from '@ethersproject/bignumber';


export interface MulticallParam {
    name: string;
    value: string;
    type: string;
}

export interface DecoderResult {
    name: string;
    params: DecoderParams[];
}

export interface DecoderParams {
    name: string;
    value: string | string[];
    type: string;
}

export interface SwapData {
    srcTokenAddress: string;
    dstTokenAddress: string;
    srcAmount: BigNumber;
    minReturnAmount: BigNumber;
}

export interface SwapTx {
    params: SwapData;
    name: string;
    type: TxType;
}


export interface UnwrapTx {
    name: string;
    type: TxType;
    params: {
        minReturnAmount: BigNumber;
        recipient: string;
    };
}

export enum TxType {
    SWAP = 'SWAP',
    UNWRAP = 'UNWRAP',
}
