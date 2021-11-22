import {Item} from './tx-ui-items.model';
import {Transaction} from './common.model';

export interface TxConfirmTemplate {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (txConfig: Transaction, decoded: any): Item[]
}
