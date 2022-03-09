import {TransactionRaw} from 'src/core/transaction-raw';
import {LimitOrderFillRichPayload} from '../../transaction-rich/payloads/limit-order-fill-rich-payload';
import {Item} from '../item';

export function limitOrderFillTemplate(
    tx: TransactionRaw,
    decoded: LimitOrderFillRichPayload
): Item[] {
    console.log(tx, decoded);

    return [
        // ******** Info
        // TODO
    ];
}
