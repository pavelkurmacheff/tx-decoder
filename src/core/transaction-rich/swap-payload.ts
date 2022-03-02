import { Token } from "./token";

export interface SwapExactInputTxRich { 
    srcToken: Token;
    dstToken: Token;
    srcAmount: string;
    minDstAmount?: string;
}

export interface SwapExactOutputTxRich { 
    srcToken: Token;
    dstToken: Token;
    dstAmount: string;
    maxSrcAmount?: string;
}