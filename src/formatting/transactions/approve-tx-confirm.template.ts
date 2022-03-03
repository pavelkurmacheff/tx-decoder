import {APPROVE_INFO_PLACEHOLDER} from '../../core/const/localizable.const';
import { TransactionRaw } from 'src/core/transaction-raw';
import { Item } from '../item';
import { ApproveTxEstimated } from 'src/core/transaction-esimated/approve-tx.estimated';

export function approveTxConfirmTemplate(tx: TransactionRaw, decoded: ApproveTxEstimated): Item[] {
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
                    text: tx.from.toLowerCase()
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
