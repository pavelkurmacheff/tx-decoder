import {TransactionRich} from '../transaction-rich/transaction-rich';
import {TransactionType} from '../transaction-type';
import {Item} from './item';
import {approveTxConfirmTemplate} from './transactions/approve-tx-confirm.template';
import {limitOrderFillTemplate} from './transactions/limit-order-fill.template';
import {swapTxConfirmTemplate as swapExactInTxConfirmTemplate} from './transactions/swap-exact-input.template';
import {swapExactOutTxConfirmTemplate} from './transactions/swap-exact-output.template';

export class ConfirmationScreenFormatterService {
    format(tx: TransactionRich): Item[] {
        switch (tx.tag) {
            case TransactionType.Approve:
                if (tx.payload) {
                    return approveTxConfirmTemplate(tx.raw, tx.payload);
                } else {
                    return [];
                }
            case TransactionType.Unwrap:
                return [];
            case TransactionType.SwapExactInput:
                return swapExactInTxConfirmTemplate(tx.raw, tx.payload);
            case TransactionType.SwapExactOutput:
                return swapExactOutTxConfirmTemplate(tx.raw, tx.payload);
            case TransactionType.LimitOrderFill:
                return limitOrderFillTemplate(tx.raw, tx.payload);
            case TransactionType.LimitOrderCancel:
                return [];
            case TransactionType.Multicall: {
                const multicallItems = tx.payload.map((i) => {
                    switch (i.tag) {
                        case 'Error':
                            return [];
                        case TransactionType.Approve:
                            if (i.payload) {
                                return approveTxConfirmTemplate(
                                    tx.raw,
                                    i.payload
                                );
                            } else {
                                return [];
                            }
                        case TransactionType.Unwrap:
                            return [];
                        case TransactionType.SwapExactInput:
                            return swapExactInTxConfirmTemplate(
                                tx.raw,
                                i.payload
                            );
                        case TransactionType.SwapExactOutput:
                            return swapExactOutTxConfirmTemplate(
                                tx.raw,
                                i.payload
                            );
                        case TransactionType.LimitOrderFill:
                            return limitOrderFillTemplate(tx.raw, i.payload);
                        case TransactionType.LimitOrderCancel:
                            return [];
                        case TransactionType.Multicall:
                            throw 'Nested multicalls not supported yet';
                        case TransactionType.AddLiquidity:
                        case TransactionType.RemoveLiquidity:
                        case TransactionType.Wrap:
                        case TransactionType.Unwrap:
                        case TransactionType.Transfer:
                            throw 'unimplemented';
                    }
                });

                return multicallItems.flat() as unknown as Item[];
            }
            case TransactionType.AddLiquidity:
            case TransactionType.RemoveLiquidity:
            case TransactionType.Wrap:
            case TransactionType.Unwrap:
            case TransactionType.Transfer:
                throw 'unimplemented';
        }
    }
}
