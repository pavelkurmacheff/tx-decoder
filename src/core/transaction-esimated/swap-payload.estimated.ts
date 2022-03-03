import { SwapExactInputRich, SwapExactOutputRich } from "../transaction-rich/swap-payload";

export interface SwapExactInputTxEstimated extends SwapExactInputRich { 
    dstAmountEstimated: string;
}

export interface SwapExactOutputTxEstimated extends SwapExactOutputRich { 
    srcAmountEstimated: string;
}