import {Token} from '../../token';

export interface SwapExactInputRichPayload {
    srcToken: Token;
    dstToken: Token;
    srcAmount: string;
    minDstAmount?: string;
    dstAmountEstimated?: string;
}

export interface SwapExactOutputRichPayload {
    srcToken: Token;
    dstToken: Token;
    dstAmount: string;
    maxSrcAmount?: string;
    srcAmountEstimated?: string;
}
