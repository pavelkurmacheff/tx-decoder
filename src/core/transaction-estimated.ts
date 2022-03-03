import { ApproveTxEstimated } from "./transaction-esimated/approve-tx.estimated";
import { LimitOrderFillEstimated } from "./transaction-esimated/limit-order-fill.estimated";
import { SwapExactInputTxEstimated, SwapExactOutputTxEstimated } from "./transaction-esimated/swap-payload.estimated";
import { TransactionRaw } from "./transaction-raw";
import { TransactionType } from "./transaction-type";


export type MulticallItem = 
    { tag: TransactionType.Approve, payload?: ApproveTxEstimated } |
    { tag: TransactionType.Unwrap } |
    { tag: TransactionType.SwapExactInput, payload: SwapExactInputTxEstimated } |
    { tag: TransactionType.SwapExactOutput, payload: SwapExactOutputTxEstimated } |
    { tag: TransactionType.LimitOrderFill, payload: LimitOrderFillEstimated } |
    { tag: TransactionType.LimitOrderCancel } |
    { tag: TransactionType.Multicall, payload: MulticallPayload };

type MulticallPayload = ({ tag: 'Error', code: string, data: any } | MulticallItem)[];

export type TransactionEstimated = 
    { raw: TransactionRaw, tag: TransactionType.Approve,  payload?: ApproveTxEstimated } |
    { raw: TransactionRaw, tag: TransactionType.Unwrap } |
    { raw: TransactionRaw, tag: TransactionType.SwapExactInput, payload: SwapExactInputTxEstimated } |
    { raw: TransactionRaw, tag: TransactionType.SwapExactOutput, payload: SwapExactOutputTxEstimated } |
    { raw: TransactionRaw, tag: TransactionType.LimitOrderFill, payload: LimitOrderFillEstimated } |
    { raw: TransactionRaw, tag: TransactionType.LimitOrderCancel } |
    { raw: TransactionRaw, tag: TransactionType.Multicall, payload: MulticallPayload };