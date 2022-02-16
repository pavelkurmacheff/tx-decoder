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
}


export interface UnwrapTx {
    name: string;
    params: {
        minReturnAmount: BigNumber;
        recipient: string;
    };
}
