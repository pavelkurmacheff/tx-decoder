import { SwapTxDecoded } from './swap-tx.model';
import { UnwrapTxDecoded } from './unwrap-tx.model';

export interface MultipleTxsDecoded {
    readonly txs: (SwapTxDecoded | UnwrapTxDecoded)[];
    readonly error?: Error;
}
