import {BigNumber} from '@ethersproject/bignumber';
import { Token } from './token';

export interface LimitOrderFillRich {
    srcToken: Token;
    srcAmount?: BigNumber;
    dstToken: Token;
    dstAmount?: BigNumber;
    minDstAmount?: BigNumber;
    maxSrcAmount?: BigNumber;
}
