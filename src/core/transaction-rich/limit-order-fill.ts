import {Token} from '../token';

export interface LimitOrderFillRich {
    srcToken: Token;
    srcAmount?: string;
    dstToken: Token;
    dstAmount?: string;
    minDstAmount?: string;
    maxSrcAmount?: string;
}
