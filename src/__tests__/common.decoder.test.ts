import {CommonTxDecoder} from '../common-tx.decoder';
import {BlockchainResources, BlockchainRpcCaller} from '../model/common.model';
import { BigNumber } from '@ethersproject/bignumber';
const fetch = require('node-fetch');

const nodeUrl = 'https://web3-node-private.1inch.exchange/';
const chainId = 1;
const apiBaseUrl = 'https://api.1inch.io/v4.0/' + chainId;

function apiRequestUrl(methodName: string, queryParams: any) {
    return apiBaseUrl + methodName + '?' + (new URLSearchParams(queryParams)).toString();
}

async function buildTxForSwap(swapParams: any): Promise<any> {
    const url = apiRequestUrl('/swap', swapParams);

    return fetch(url)
        .then((res: any) => res.json())
        .then((res: any) => {
            return res.tx;
        });
}

describe.skip('OinchTxDecoder integration test', () => {
    let commonTxDecoder: CommonTxDecoder;
    let resources: BlockchainResources;

    const rpcCaller: BlockchainRpcCaller = {
        rpcUrl: nodeUrl,
        call<T>(method: string, params: unknown[]): Promise<T> {
            return fetch(nodeUrl, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'referer': 'http://localhost:4200/',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
                        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
                },
                body: JSON.stringify({
                    method,
                    params,
                    jsonrpc: '2.0',
                    id: Date.now()
                })
            })
                .then((res: { json: () => any; }) => {
                    return res.json();
                })
                .then((res: { result: T; }) => {
                    return res.result as T;
                });
        }
    };

    beforeAll(async () => {
        resources = await Promise.all([
            fetch('https://tokens.1inch.io/v1.1/' + chainId).then((res: { json: () => any; }) => res.json()),
            fetch('https://token-prices.1inch.io/v1.1/' + chainId).then((res: { json: () => any; }) => res.json()),
        ]).then(([tokens, tokenPrices]) => {
            return {tokens, tokenPrices} as BlockchainResources;
        });
    });

    beforeEach(() => {
        commonTxDecoder = new CommonTxDecoder(resources, rpcCaller, chainId);
    });

    it('decodeTxByLogs()', async () => {
        const result = await commonTxDecoder.decodeTxByLogs(
            '0x1b251d13fd530ddf2d4125631c71ee07b56568c1a6cf55a8e53a29a599b81e92'
        );

        expect(result.data).toEqual({foo: 'bar'});
    });

    it('decodeTxByEstimation() 1inch', async () => {
        const walletAddress = '0x0ef1b8a0e726fc3948e15b23993015eb1627f210';
        const swapParams = {
            fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            toTokenAddress: '0x111111111117dc0aa78b770fa6a738034120c302',
            amount: '10000000000000000',
            fromAddress: walletAddress,
            slippage: 1,
            disableEstimate: false,
            allowPartialFill: false,
        };

        const swapTransaction = await buildTxForSwap(swapParams);
        const result = await commonTxDecoder.decodeTxByEstimation(swapTransaction);

        expect(result.data).toEqual({foo: 'bar'});
    });

    it('decodeTxByEstimation() uniV3', async () => {
        const block = await commonTxDecoder.web3Service.web3.eth.getBlock("latest");
        const swapTransaction = {
            data: '0x5ae401dc00000000000000000000000000000000000000000000000000000000620f9fac000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e442712a67000000000000000000000000000000000000000000000001e5b8fa8fe2ac00000000000000000000000000000000000000000000000000000062bb20e4b8a7d10000000000000000000000000000000000000000000000000000000000000080000000000000000000000000d8fa3fc359a464bfdd3c7339a10b227732bb1ad90000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000111111111117dc0aa78b770fa6a738034120c30200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000412210e8a00000000000000000000000000000000000000000000000000000000',
            from: '0xd8fa3FC359A464BFDd3C7339A10B227732Bb1Ad9',
            gasLimit: BigNumber.from(block.gasLimit),
            gasPrice: BigNumber.from(block.baseFeePerGas).mul(BigNumber.from(2)),
            to: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
            value: '30000000000000000',
        }
        const result = await commonTxDecoder.decodeTxByEstimation(swapTransaction);

        expect(JSON.stringify(result.data)).toEqual(JSON.stringify({
            "txs": [
                {
                    "dstToken": {
                        "symbol": "1INCH",
                        "name": "1INCH Token",
                        "decimals": 18,
                        "address": "0x111111111117dc0aa78b770fa6a738034120c302",
                        "logoURI": "https://tokens.1inch.io/0x111111111117dc0aa78b770fa6a738034120c302.png",
                        "eip2612": true
                    },
                    "srcToken": {
                        "symbol": "ETH",
                        "name": "Ethereum",
                        "decimals": 18,
                        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                        "logoURI": "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
                    },
                    "amountInMaximum": {
                        "type": "BigNumber",
                        "hex": "0x62bb20e4b8a7d1"
                    },
                    "dstAmount": {
                        "type": "BigNumber",
                        "hex": "0x01e5b8fa8fe2ac0000"
                    }
                }
            ]
        }));
    });
});
