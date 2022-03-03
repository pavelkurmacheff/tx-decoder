import {TransactionRaw} from './transaction-raw';
import {ApproveTxRich} from './transaction-rich/approve-tx.model';
import {LimitOrderFillRich} from './transaction-rich/limit-order-fill.model';
import {
    SwapExactInputTxRich,
    SwapExactOutputTxRich,
} from './transaction-rich/swap-payload';
import {TransactionType} from './transaction-type';

export type MulticallRichItem =
    | {tag: TransactionType.Approve; payload?: ApproveTxRich}
    | {tag: TransactionType.Unwrap}
    | {tag: TransactionType.SwapExactInput; payload: SwapExactInputTxRich}
    | {tag: TransactionType.SwapExactOutput; payload: SwapExactOutputTxRich}
    | {tag: TransactionType.LimitOrderFill; payload: LimitOrderFillRich}
    | {tag: TransactionType.LimitOrderCancel}
    | {tag: TransactionType.Multicall};

export type MulticallPayloadRich = (
    | {tag: 'Error'; code: string; data: any}
    | MulticallRichItem
)[];

/* prettier-ignore */
export type TransactionRich = 
{ raw: TransactionRaw, tag: TransactionType.Approve, payload?: ApproveTxRich } |
{ raw: TransactionRaw, tag: TransactionType.Unwrap } |
{ raw: TransactionRaw, tag: TransactionType.SwapExactInput, payload: SwapExactInputTxRich } |
{ raw: TransactionRaw, tag: TransactionType.SwapExactOutput, payload: SwapExactOutputTxRich } |
{ raw: TransactionRaw, tag: TransactionType.LimitOrderFill, payload: LimitOrderFillRich } |
{ raw: TransactionRaw, tag: TransactionType.LimitOrderCancel } |
{ raw: TransactionRaw, tag: TransactionType.Multicall,  payload: MulticallPayloadRich } | 
{ raw: TransactionRaw, tag: TransactionType.SwapThroughPool,  payload: SwapExactInputTxRich };
