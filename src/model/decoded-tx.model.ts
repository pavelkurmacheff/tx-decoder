import { ApproveTxDecoded } from '../decoders/approve/approve-tx.decoder';
import { SwapTxDecoded } from './swap-tx.model';
import { MultipleTxsDecoded } from './multiple-tx.model';
import { UnwrapTxDecoded } from './unwrap-tx.model';

export type DecodedTx = ApproveTxDecoded
    | SwapTxDecoded
    | UnwrapTxDecoded
    | MultipleTxsDecoded;
