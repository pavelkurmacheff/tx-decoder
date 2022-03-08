import { TransactionRaw } from 'src/core/transaction-raw';
import { LimitOrderFillRich } from '../../transaction-rich/limit-order-fill';
import { Item } from '../item';

export function limitOrderFillTemplate(tx: TransactionRaw, decoded: LimitOrderFillRich): Item[] {
    console.log(tx, decoded);
    
    return [
        // ******** Info
        // TODO
    ];
}
