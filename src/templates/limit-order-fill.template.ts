import {ApproveTxDecoded} from '../model/approve-tx.model';
import {Transaction} from '../model/common.model';
import {Item} from '../model/tx-ui-items.model';

export function limitOrderFillTemplate(
    txConfig: Transaction,
    decoded: ApproveTxDecoded
): Item[] {
    return [
        // ******** Info
    ];
}
