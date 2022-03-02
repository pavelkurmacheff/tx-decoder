import { SwapTxDecoded } from './swap-tx.model';
import { UnwrapTxDecoded } from './unwrap-tx.model';
import { ApproveTxDecoded } from '../../../core/transaction-rich/approve-tx.model';

export interface MultipleTxsDecoded {
    readonly txs: (SwapTxDecoded | UnwrapTxDecoded | ApproveTxDecoded)[];
    readonly error?: Error;
}
