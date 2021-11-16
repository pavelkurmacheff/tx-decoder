import { Item } from '../model/tx-ui-items.model';
import {BuilderParams} from '../model/common.model';
import {formatUnits} from '@ethersproject/units';

export interface SwapTxItemData {
    desc: {
        srcToken: string,
        dstToken: string,
        amount: string,
        minReturnAmount: string,
    }
}

export async function swapTxConfirmDataBuilder(params: BuilderParams<SwapTxItemData>): Promise<Item[]> {
    const {resources, txConfig, data, rpcCaller} = params;

    const {
        srcToken: srcTokenAddress,
        dstToken: dstTokenAddress,
        amount: srcAmount,
        minReturnAmount
    } = data.desc;

    const srcToken = resources.tokens[srcTokenAddress.toLowerCase()];
    const dstToken = resources.tokens[dstTokenAddress.toLowerCase()];
    const dstAmount = await rpcCaller.call<string>('eth_call', [txConfig])
        .then(response => BigInt(response).toString(10));
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
                    sourceAmount: '1',
                    destinationToken: dstToken,
                    destinationAmount: ((+srcUnits) / (+dstUnits)).toString()
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
                    sourceAmount: '1',
                    destinationToken: srcToken,
                    destinationAmount: ((+dstUnits) / (+srcUnits)).toString()
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
