import { Item } from '../model/tx-ui-items.model';
import {BlockchainResources, Transaction} from '../model/common.model';
import {parseUnits, formatUnits} from '@ethersproject/units';

export interface SwapTxItemData {
    desc: {
        srcToken: string,
        dstToken: string,
        amount: string,
        minReturnAmount: string,
    }
}

export function swapTxConfirmDataBuilder(
    resources: BlockchainResources,
    txConfig: Transaction,
    data: SwapTxItemData
): Item[] {
    const {
        srcToken: srcTokenAddress,
        dstToken: dstTokenAddress,
        amount: srcAmount,
        minReturnAmount
    } = data.desc;
    const srcToken = resources.tokens[srcTokenAddress.toLowerCase()];
    const dstToken = resources.tokens[dstTokenAddress.toLowerCase()];
    const dstAmount = '113841200360986751251430'; // TODO

    const srcUnits = formatUnits(srcAmount, srcToken.decimals);
    const dstUnits = formatUnits(dstAmount, dstToken.decimals);

    if (!srcToken) {
        throw new Error('Src token is not found for swapTxConfirmDataBuilder: ' + data.desc.srcToken.toLowerCase());
    }

    if (!dstToken) {
        throw new Error('Dst token is not found for swapTxConfirmDataBuilder: ' + data.desc.dstToken.toLowerCase());
    }

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
                    value: srcAmount,
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
                    value: dstAmount,
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
        // ******** Sell price // TODO
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
                    sourceAmount: parseUnits('1', srcToken.decimals).toString(),
                    destinationToken: dstToken,
                    destinationAmount: parseUnits(
                        Math.round((+srcUnits) / (+dstUnits)).toString(),
                        dstToken.decimals
                    ).toString()
                }
            }
        },
        // ******** Buy price // TODO
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
                    sourceAmount: parseUnits('1', dstToken.decimals).toString(),
                    destinationToken: srcToken,
                    destinationAmount: parseUnits(
                        Math.round((+dstUnits) / (+srcUnits)).toString(),
                        srcToken.decimals
                    ).toString()
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
                    value: minReturnAmount,
                    sign: '0'
                }
            }
        },
    ];
}
