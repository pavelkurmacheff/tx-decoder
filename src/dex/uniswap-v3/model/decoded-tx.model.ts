import {SwapTxDecoded} from './swap-tx.model';
import {MultipleTxsDecoded} from './multiple-tx.model';
import {UnwrapTxDecoded} from './unwrap-tx.model';
import {ApproveTxDecoded} from '../../../core/transaction-rich/approve-tx.model';
import {LimitOrderFillDecoded} from '../../../core/transaction-rich/limit-order-fill.model';

export type DecodedTx =
    | ApproveTxDecoded
    | SwapTxDecoded
    | UnwrapTxDecoded
    | MultipleTxsDecoded
    | LimitOrderFillDecoded;
