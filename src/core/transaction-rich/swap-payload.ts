import {Token} from '../token';

export interface SwapExactInputRich {
    srcToken: Token;
    dstToken: Token;
    srcAmount: string;
    minDstAmount?: string;
    dstAmountEstimated?: string;
}

export interface SwapExactOutputRich {
    srcToken: Token;
    dstToken: Token;
    dstAmount: string;
    maxSrcAmount?: string;
    srcAmountEstimated?: string;
}
