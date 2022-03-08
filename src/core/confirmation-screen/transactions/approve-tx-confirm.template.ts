import { TransactionRaw } from 'src/core/transaction-raw';
import { Item } from '../item';
import { ApproveTxEstimated } from 'src/core/transaction-esimated/approve-tx.estimated';

export const APPROVE_INFO_PLACEHOLDER = 'To continue, you need to allow 1inch smart contracts' +
    ' to use your %%0%%. This has to be done only once for each token.';

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
