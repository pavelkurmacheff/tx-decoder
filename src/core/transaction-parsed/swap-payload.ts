export interface SwapExactInputTx {
    srcTokenAddress: string | 'native';
    dstTokenAddress: string | 'native';
    srcAmount: string;
    minDstAmount?: string;
}

export interface SwapExactOutputTx {
    srcTokenAddress: string | 'native';
    dstTokenAddress: string | 'native';
    dstAmount: string;
    maxSrcAmount?: string;
}

export interface SwapThroughPoolPayload {
    srcTokenAddress: string | 'native';
    srcAmount: string;
    minDstAmount?: string;
    poolAddressess: string[];
}
