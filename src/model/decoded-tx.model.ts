import {SwapTxDecoded} from './swap-tx.model';
import {MultipleTxsDecoded} from './multiple-tx.model';
import {UnwrapTxDecoded} from './unwrap-tx.model';
import {ApproveTxDecoded} from './approve-tx.model';
import {LimitOrderFillDecoded} from './limit-order-fill.model';

export type DecodedTx =
    | ApproveTxDecoded
    | SwapTxDecoded
    | UnwrapTxDecoded
    | MultipleTxsDecoded
    | LimitOrderFillDecoded;
