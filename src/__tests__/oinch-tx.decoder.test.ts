import {OinchTxDecoder} from '../oinch-tx.decoder';
import {BlockchainResources, BlockchainRpcCaller} from '../model/common.model';
const fetch = require('node-fetch');

const nodeUrl = 'SET_YOUR_NODE_URL';
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
    let oinchTxDecoder: OinchTxDecoder;
    let resources: BlockchainResources;

    const rpcCaller: BlockchainRpcCaller = {
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
        oinchTxDecoder = new OinchTxDecoder(resources, rpcCaller);
    });

    it('decodeTxByLogs()', async () => {
        const result = await oinchTxDecoder.decodeTxByLogs(
            '0x1b251d13fd530ddf2d4125631c71ee07b56568c1a6cf55a8e53a29a599b81e92'
        );

        expect(result.data).toEqual({foo: 'bar'});
    });

    it('decodeTxByEstimation()', async () => {
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
        const result = await oinchTxDecoder.decodeTxByEstimation(swapTransaction);

        expect(result.data).toEqual({foo: 'bar'});
    });
});
