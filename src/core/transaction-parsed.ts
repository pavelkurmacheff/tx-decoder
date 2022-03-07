import {ApproveTxPayload} from './transaction-parsed/approve-payload';
import {LimitOrderFillPayload} from './transaction-parsed/limit-order-fill-payload';
import {
    SwapExactInputPayload,
    SwapExactOutputPayload,
    SwapThroughPoolPayload,
} from './transaction-parsed/swap-payload';
import {TransferTxPayload} from './transaction-parsed/transfer-payload';
import {ValueTxPayload} from './transaction-parsed/value-payload';
import {TransactionRaw} from './transaction-raw';
import {TransactionType} from './transaction-type';

export type MulticallItem =
    | {tag: TransactionType.Approve; payload?: ApproveTxPayload}
    | {tag: TransactionType.Deposit; payload: ValueTxPayload}
    | {tag: TransactionType.Withdraw; payload: ValueTxPayload}
    | {tag: TransactionType.Transfer; payload: TransferTxPayload}
    | {tag: TransactionType.Unwrap}
    | {tag: TransactionType.SwapExactInput; payload: SwapExactInputPayload}
    | {tag: TransactionType.SwapExactOutput; payload: SwapExactOutputPayload}
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
    | {raw: TransactionRaw, tag: TransactionType.Deposit; payload: ValueTxPayload}
    | {raw: TransactionRaw, tag: TransactionType.Withdraw; payload: ValueTxPayload}
    | {raw: TransactionRaw, tag: TransactionType.Transfer; payload: TransferTxPayload}
    | {raw: TransactionRaw, tag: TransactionType.Unwrap}
    | {raw: TransactionRaw, tag: TransactionType.SwapExactInput, payload: SwapExactInputPayload}
    | {raw: TransactionRaw, tag: TransactionType.SwapExactOutput, payload: SwapExactOutputPayload}
    | {raw: TransactionRaw, tag: TransactionType.LimitOrderFill,payload: LimitOrderFillPayload}
    | {raw: TransactionRaw; tag: TransactionType.LimitOrderCancel}
    | {raw: TransactionRaw, tag: TransactionType.Multicall, payload: MulticallPayload }
    | {raw: TransactionRaw, tag: TransactionType.SwapThroughPool,payload: SwapThroughPoolPayload};
