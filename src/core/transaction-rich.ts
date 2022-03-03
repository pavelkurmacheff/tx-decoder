import {TransactionRaw} from './transaction-raw';
import {ApproveRich} from './transaction-rich/approve';
import {LimitOrderFillRich} from '././transaction-rich/limit-order-fill
import {
    SwapExactInputRich,
    SwapExactOutputRich,
} from './transaction-rich/swap-payload';
import {TransactionType} from './transaction-type';

export type MulticallRichItem =
    | {tag: TransactionType.Approve; payload?: ApproveRich}
    | {tag: TransactionType.Unwrap}
    | {tag: TransactionType.SwapExactInput; payload: SwapExactInputRich}
    | {tag: TransactionType.SwapExactOutput; payload: SwapExactOutputRich}
    | {tag: TransactionType.LimitOrderFill; payload: LimitOrderFillRich}
    | {tag: TransactionType.LimitOrderCancel}
    | {tag: TransactionType.Multicall};

export type MulticallPayloadRich = (
    | {tag: 'Error'; code: string; data: any}
    | MulticallRichItem
)[];

/* prettier-ignore */
export type TransactionRich = 
{ raw: TransactionRaw, tag: TransactionType.Approve, payload?: ApproveRich } |
{ raw: TransactionRaw, tag: TransactionType.Unwrap } |
{ raw: TransactionRaw, tag: TransactionType.SwapExactInput, payload: SwapExactInputRich } |
{ raw: TransactionRaw, tag: TransactionType.SwapExactOutput, payload: SwapExactOutputRich } |
{ raw: TransactionRaw, tag: TransactionType.LimitOrderFill, payload: LimitOrderFillRich } |
{ raw: TransactionRaw, tag: TransactionType.LimitOrderCancel } |
{ raw: TransactionRaw, tag: TransactionType.Multicall,  payload: MulticallPayloadRich } | 
{ raw: TransactionRaw, tag: TransactionType.SwapThroughPool,  payload: SwapExactInputRich };
