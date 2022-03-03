import {formatUnits} from '@ethersproject/units';
import { SwapExactInputTxEstimated } from 'src/core/transaction-esimated/swap-payload.estimated';
import { TransactionRaw } from 'src/core/transaction-raw';
import { Item } from '../item';

export function swapTxConfirmTemplate(tx: TransactionRaw, decoded: SwapExactInputTxEstimated): Item[] {
    const {srcAmount, srcToken, dstToken, minDstAmount, dstAmountEstimated} = decoded;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const srcUnits = formatUnits(srcAmount, srcToken.decimals);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dstUnits = formatUnits(dstAmountEstimated, dstToken.decimals);

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
                    value: srcAmount? srcAmount.toString(): '0',
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
                    value: dstAmountEstimated ? dstAmountEstimated.toString(): '0',
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
                    value: minDstAmount? minDstAmount.toString(): '0',
                    sign: '0'
                }
            }
        },
    ];
}
