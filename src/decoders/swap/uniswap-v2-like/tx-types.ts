export enum TxType {
    SwapExactInput,
    SwapExactOutput,
    Unwrap,
    Permit,
}

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

export type Tx = 
    { tag: TxType.Permit } |
    { tag: TxType.Unwrap } |
    { tag: TxType.SwapExactInput, payload: SwapExactInputTx } |
    { tag: TxType.SwapExactOutput, payload: SwapExactOutputTx } 
