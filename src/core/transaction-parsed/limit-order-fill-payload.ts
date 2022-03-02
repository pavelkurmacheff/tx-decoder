import {BigNumber} from '@ethersproject/bignumber';

export interface LimitOrderFillPayload {
    srcTokenAddress: string;
    srcAmount?: BigNumber;
    dstTokenAddress: string;
    dstAmount?: BigNumber;
    minDstAmount?: BigNumber;
    maxSrcAmount?: BigNumber;
}
