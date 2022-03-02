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

export enum TxType {
    SWAP_INPUT = 'SWAP_EXACT_INPUT',
    SWAP_OUTPUT = 'SWAP_EXACT_OUTPUT',
    UNWRAP = 'UNWRAP',
    PERMIT = 'PERMIT',
}


export interface SwapData {
    srcTokenAddress: string;
    dstTokenAddress: string;
    srcAmount?: BigNumber;
    dstAmount?: BigNumber;
    minReturnAmount?: BigNumber;
    amountInMaximum?: BigNumber;
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




export interface PermitTx {
    params: {
        token: string;
        nonce: BigNumber;
        expiry: BigNumber;
    };
    name: string;
    type: TxType;
}
