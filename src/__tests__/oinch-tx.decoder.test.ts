import { OinchTxDecoder } from '../oinch-tx.decoder';
import { BlockchainResources, BlockchainRpcCaller, Transaction } from '../model/common.model';
import { BigNumber } from '@ethersproject/bignumber';
import { UniswapV3TxDecoder } from '../decoders/swap/uniswap/uniswap-v3-tx.decoder';

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
    let uniswapV3TxDecoder: UniswapV3TxDecoder;
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
                .then(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res => {
                    return res.json();
                })
                .then(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    res => {
                    return res.result as T;
                });
        }
    };

    beforeAll(async () => {
        resources = await Promise.all([
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fetch('https://tokens.1inch.io/v1.1/' + chainId).then(res => res.json()),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fetch('https://token-prices.1inch.io/v1.1/' + chainId).then(res => res.json()),
        ]).then(([tokens, tokenPrices]) => {
            return {tokens, tokenPrices} as BlockchainResources;
        });
    });

    beforeEach(() => {
        oinchTxDecoder = new OinchTxDecoder(resources, rpcCaller);
        uniswapV3TxDecoder = new UniswapV3TxDecoder(resources, rpcCaller);
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

    it('decodeTxByEstimation() univ3', async () => {
        const tx: Transaction = {
            data: '0x414bf389000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000db9a26cd9e6c2a2acd8896670e6a71d5052094150000000000000000000000000000000000000000000000000000000061ec6544000000000000000000000000000000000000000000000000d00f0790180f200000000000000000000000000000000000000000000000000000000007d788a4a20000000000000000000000000000000000000000000000000000000000000000',
            from: '0xDB9A26cd9e6C2A2ACd8896670e6a71d505209415',
            gasLimit: BigNumber.from('199998'),
            gasPrice: BigNumber.from('182223989819'),
            to: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            value: '14992210000000000000'
        };
        const result = await uniswapV3TxDecoder.decodeByConfig(tx);

        expect(result).toBeDefined()
    });
});
