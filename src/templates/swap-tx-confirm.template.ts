import {Transaction} from '../model/common.model';
import {Item} from '../model/tx-ui-items.model';
import {formatUnits} from '@ethersproject/units';
import {SwapTxDecoded} from '../model/swap-tx.model';

export function swapTxConfirmTemplate(txConfig: Transaction, decoded: SwapTxDecoded): Item[] {
    const {srcAmount, dstAmount, srcToken, dstToken, minReturnAmount} = decoded;
    const srcUnits = formatUnits(srcAmount, srcToken.decimals);
    const dstUnits = formatUnits(dstAmount, dstToken.decimals);

    return [
        // ******** From token
        {
            key: {
                type: 'token',
                value: {
                    type: 'from',
                    token: srcToken
                }
            },
            value: {
                type: 'amount',
                value: {
                    token: srcToken,
                    value: srcAmount.toString(),
                    sign: '-'
                }
            }
        },
        // ******** To token
        {
            key: {
                type: 'token',
                value: {
                    type: 'to',
                    token: dstToken
                }
            },
            value: {
                type: 'amount',
                value: {
                    token: dstToken,
                    value: dstAmount.toString(),
                    sign: '+'
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
        // ******** Sell price
        {
            key: {
                type: 'title',
                value: {
                    title: 'Sell price'
                }
            },
            value: {
                type: 'rate',
                value: {
                    sourceToken: srcToken,
                    sourceAmount: '1',
                    destinationToken: dstToken,
                    destinationAmount: ((+dstUnits) / (+srcUnits)).toString()
                }
            }
        },
        // ******** Buy price
        {
            key: {
                type: 'title',
                value: {
                    title: 'Buy price'
                }
            },
            value: {
                type: 'rate',
                value: {
                    sourceToken: dstToken,
                    sourceAmount: '1',
                    destinationToken: srcToken,
                    destinationAmount: ((+srcUnits) / (+dstUnits)).toString()
                }
            }
        },
        // ******** Minimum Received
        {
            key: {
                type: 'title',
                value: {
                    title: 'Minimum Received'
                }
            },
            value: {
                type: 'amount',
                value: {
                    token: dstToken,
                    value: minReturnAmount.toString(),
                    sign: '0'
                }
            }
        },
    ];
}
