import { ApproveTxPayload } from "./transaction-parsed/approve-payload";
import { LimitOrderFillPayload } from "./transaction-parsed/limit-order-fill-payload";
import { TransactionType } from "./transaction-type";

export type MulticallPayload = ({ tag: 'Error', code: string, data: any } | TransactionParsed)[]

export type TransactionParsed = 
    { tag: TransactionType.Approve, payload?: ApproveTxPayload } |
    { tag: TransactionType.Unwrap } |
    { tag: TransactionType.SwapExactInput, payload: SwapExactInputTx } |
    { tag: TransactionType.SwapExactOutput, payload: SwapExactOutputTx } |
    { tag: TransactionType.LimitOrderFill, payload: LimitOrderFillPayload } |
    { tag: TransactionType.LimitOrderCancel } |
    { tag: TransactionType.Multicall, payload: MulticallPayload }