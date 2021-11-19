import { Item } from '../model/tx-ui-items.model';
import {BuilderParams} from '../model/common.model';
import {BigNumber} from '@ethersproject/bignumber';
import {findTokenByAddress} from './helpers/tokens.helper';
import {APPROVE_INFO_PLACEHOLDER} from './const/localizable.const';

export interface ApproveTxItemData {
    _value: BigNumber;
}

export async function approveTxConfirmDataBuilder(
    params: BuilderParams<ApproveTxItemData>
): Promise<Item[]> {
    const {resources, txConfig, data} = params;
    const token = findTokenByAddress(resources, txConfig.to.toLowerCase());

    if (!token) {
        throw new Error('Token is not found for approveTxItemBuilder: ' + txConfig.to);
    }

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
                    args: [token.symbol]
                }
            }
        },
        // ******** Approve amount
        {
            key: {
                type: 'token',
                value: {
                    type: 'amount',
                    token
                }
            },
            value: {
                type: 'amount',
                value: {
                    token,
                    value: data._value.toString(),
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
