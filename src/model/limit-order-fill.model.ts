import {BigNumber} from '@ethersproject/bignumber';
import {Token} from './common.model';

export interface LimitOrderFillDecoded {
    srcToken: Token;
    srcAmount?: BigNumber;
    dstToken: Token;
    dstAmount?: BigNumber;
    minDstAmount?: BigNumber;
    maxSrcAmount?: BigNumber;
}
