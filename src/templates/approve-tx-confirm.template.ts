import {APPROVE_INFO_PLACEHOLDER} from '../const/localizable.const';
import {Transaction} from '../model/common.model';
import {Item} from '../model/tx-ui-items.model';
import { ApproveTxDecoded } from '../model/approve-tx.model';

export function approveTxConfirmTemplate(txConfig: Transaction, decoded: ApproveTxDecoded): Item[] {
    return [
        // ******** Info
        {
            key: {
                type: 'placeholder'
            },
            value: {
                type: 'localizable',
                value: {
                    format: APPROVE_INFO_PLACEHOLDER,
                    args: [decoded.token.symbol]
                }
            }
        },
        // ******** Approve amount
        {
            key: {
                type: 'token',
                value: {
                    type: 'amount',
                    token: decoded.token
                }
            },
            value: {
                type: 'amount',
                value: {
                    token: decoded.token,
                    value: decoded.value.toString(),
                    sign: '0'
                }
            }
        },
        // ******** Your wallet
        {
            key: {
                type: 'wallet',
                value: {
                    type: 'own',
                }
            },
            value: {
                type: 'text',
                value: {
                    type: 'address',
                    text: txConfig.from.toLowerCase()
                }
            }
        },
        // ******** Gas fee
        {
            key: {
                type: 'placeholder'
            },
            value: {
                type: 'placeholder',
                value: {
                    type: 'fee'
                }
            }
        },
    ];
}
