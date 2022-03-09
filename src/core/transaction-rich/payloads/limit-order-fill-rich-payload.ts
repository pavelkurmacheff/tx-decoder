import {Token} from '../../token';

export interface LimitOrderFillRichPayload {
    srcToken: Token;
    srcAmount?: string;
    dstToken: Token;
    dstAmount?: string;
    minDstAmount?: string;
    maxSrcAmount?: string;
}
