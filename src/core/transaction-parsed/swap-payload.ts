export interface SwapExactInputPayload {
    srcTokenAddress: string | 'native';
    dstTokenAddress: string | 'native';
    srcAmount: string;
    minDstAmount?: string;
}

export interface SwapExactOutputPayload {
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
