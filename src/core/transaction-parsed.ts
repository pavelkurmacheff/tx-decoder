import {ApproveTxPayload} from './transaction-parsed/approve-payload';
import {LimitOrderFillPayload} from './transaction-parsed/limit-order-fill-payload';
import {
    SwapExactInputTx,
    SwapExactOutputTx,
    SwapThroughPoolPayload,
} from './transaction-parsed/swap-payload';
import {TransactionRaw} from './transaction-raw';
import {TransactionType} from './transaction-type';

export type MulticallItem =
    | {tag: TransactionType.Approve; payload?: ApproveTxPayload}
    | {tag: TransactionType.Unwrap}
    | {tag: TransactionType.SwapExactInput; payload: SwapExactInputTx}
    | {tag: TransactionType.SwapExactOutput; payload: SwapExactOutputTx}
    | {tag: TransactionType.LimitOrderFill; payload: LimitOrderFillPayload}
    | {tag: TransactionType.LimitOrderCancel}
    | {tag: TransactionType.Multicall; payload: MulticallPayload};

export type MulticallPayload = (
    | {tag: 'Error'; code: string; data: any}
    | MulticallItem
)[];

/* prettier-ignore */
export type TransactionParsed =
    | {raw: TransactionRaw, tag: TransactionType.Approve, payload?: ApproveTxPayload}
    | {raw: TransactionRaw, tag: TransactionType.Unwrap}
    | {raw: TransactionRaw, tag: TransactionType.SwapExactInput, payload: SwapExactInputTx}
    | {raw: TransactionRaw, tag: TransactionType.SwapExactOutput, payload: SwapExactOutputTx}
    | {raw: TransactionRaw, tag: TransactionType.LimitOrderFill,payload: LimitOrderFillPayload}
    | {raw: TransactionRaw; tag: TransactionType.LimitOrderCancel}
    | {raw: TransactionRaw, tag: TransactionType.Multicall, payload: MulticallPayload }
    | {raw: TransactionRaw, tag: TransactionType.SwapThroughPool,payload: SwapThroughPoolPayload};
