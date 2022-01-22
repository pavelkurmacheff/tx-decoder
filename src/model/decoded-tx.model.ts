import {ApproveTxDecoded} from '../decoders/approve/approve-tx.decoder';
import {SwapTxDecoded} from './swap-tx.model';

export type DecodedTx = ApproveTxDecoded
    | SwapTxDecoded;
