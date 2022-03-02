import {Item} from '../dex/uniswap-v3/model/tx-ui-items.model';
import {formatUnits} from '@ethersproject/units';
import {SwapTxDecoded} from '../dex/uniswap-v3/model/swap-tx.model';
import { TransactionRaw } from 'src/core/transaction-raw';

// TODO: Change SwapTxDecoded to new Swap models
export function swapTxConfirmTemplate(tx: TransactionRaw, decoded: SwapTxDecoded): Item[] {
    const {srcAmount, dstAmount, srcToken, dstToken, minReturnAmount} = decoded;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const srcUnits = formatUnits(srcAmount, srcToken.decimals);
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
                    value: minReturnAmount? minReturnAmount.toString(): '0',
                    sign: '0'
                }
            }
        },
    ];
}
