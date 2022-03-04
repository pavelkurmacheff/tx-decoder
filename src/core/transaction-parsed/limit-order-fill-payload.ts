import {BigNumber} from '@ethersproject/bignumber';

export interface LimitOrderFillPayload {
    srcTokenAddress: string;
    srcAmount?: string;
    dstTokenAddress: string;
    dstAmount?: string;
    minDstAmount?: string;
    maxSrcAmount?: string;
}
