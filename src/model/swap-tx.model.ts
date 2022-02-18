import {BigNumber} from '@ethersproject/bignumber';
import {Token} from './common.model';

export interface SwapTxDecoded {
    readonly srcToken: Token;
    readonly srcAmount?: BigNumber;
    readonly dstToken: Token;
    readonly dstAmount?: BigNumber;
    readonly minReturnAmount?: BigNumber;
    readonly amountInMaximum?: BigNumber;
    readonly error?: Error;
}





export interface SwapTxDecodeInput {
    srcTokenAddress: string;
    dstTokenAddress: string;
    srcAmount: string;
    minReturnAmount: string;
    dstAmount: BigNumber;
    readonly error?: Error;
}
