import { SwapTxDecoded } from './swap-tx.model';
import { MultipleTxsDecoded } from './multiple-tx.model';
import { UnwrapTxDecoded } from './unwrap-tx.model';
import { ApproveTxDecoded } from './approve-tx.model';

export type DecodedTx = ApproveTxDecoded
    | SwapTxDecoded
    | UnwrapTxDecoded
    | MultipleTxsDecoded;
