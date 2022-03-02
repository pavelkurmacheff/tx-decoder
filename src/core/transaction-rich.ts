import { ApproveTxRich } from "./transaction-rich/approve-tx.model";
import { LimitOrderFillRich } from "./transaction-rich/limit-order-fill.model";
import { SwapExactInputTxRich, SwapExactOutputTxRich } from "./transaction-rich/swap-payload";
import { TransactionType } from "./transaction-type";

export type TransactionRich = 
{ tag: TransactionType.Approve, payload?: ApproveTxRich } |
{ tag: TransactionType.Unwrap } |
{ tag: TransactionType.SwapExactInput, payload: SwapExactInputTxRich } |
{ tag: TransactionType.SwapExactOutput, payload: SwapExactOutputTxRich } |
{ tag: TransactionType.LimitOrderFill, payload: LimitOrderFillRich } |
{ tag: TransactionType.LimitOrderCancel } |
{ tag: TransactionType.Multicall }