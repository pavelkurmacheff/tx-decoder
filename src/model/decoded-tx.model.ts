import {ApproveTxDecoded} from '../decoders/approve-tx.decoder';
import {SwapTxDecoded} from './swap-tx.model';

export type DecodedTx = ApproveTxDecoded
    | SwapTxDecoded;
