interface SwapExactInputTx { 
    srcTokenAddress: string | 'native';
    dstTokenAddress: string | 'native';
    srcAmount: string;
    minDstAmount?: string;
}

interface SwapExactOutputTx { 
    srcTokenAddress: string | 'native';
    dstTokenAddress: string | 'native';
    dstAmount: string;
    maxSrcAmount?: string;
}