import { SwapExactInputTxRich, SwapExactOutputTxRich } from "../transaction-rich/swap-payload";

export interface SwapExactInputTxEstimated extends SwapExactInputTxRich { 
    dstAmountEstimated: string;
}

export interface SwapExactOutputTxEstimated extends SwapExactOutputTxRich { 
    srcAmountEstimated: string;
}