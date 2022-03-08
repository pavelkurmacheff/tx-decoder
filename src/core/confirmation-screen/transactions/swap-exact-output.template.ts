import {formatUnits} from '@ethersproject/units';
import { SwapExactOutputTxEstimated } from 'src/core/transaction-esimated/swap-payload.estimated';
import { TransactionRaw } from 'src/core/transaction-raw';
import { Item } from '../item';

export function swapExactOutTxConfirmTemplate(tx: TransactionRaw, decoded: SwapExactOutputTxEstimated): Item[] {
    const {srcAmountEstimated, dstAmount, srcToken, dstToken, maxSrcAmount} = decoded;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const srcUnits = formatUnits(srcAmountEstimated, srcToken.decimals);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
                    value: srcAmountEstimated ? srcAmountEstimated.toString() : '0',
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
                    value: dstAmount? dstAmount.toString(): '0',
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
        // ******** Maximum Spent
        {
            key: {
                type: 'title',
                value: {
                    title: 'Maximum Spent'
                }
            },
            value: {
                type: 'amount',
                value: {
                    token: dstToken,
                    value: maxSrcAmount ? maxSrcAmount.toString() : '0',
                    sign: '0'
                }
            }
        },
    ];
}
