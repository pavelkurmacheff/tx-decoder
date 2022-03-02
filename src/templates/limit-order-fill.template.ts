import { TransactionRaw } from 'src/core/transaction-raw';
import { LimitOrderFillRich } from 'src/core/transaction-rich/limit-order-fill.model';
import {Item} from '../dex/uniswap-v3/model/tx-ui-items.model';

export function limitOrderFillTemplate(tx: TransactionRaw, decoded: LimitOrderFillRich): Item[] {
    return [
        // ******** Info
        // TODO
    ];
}
