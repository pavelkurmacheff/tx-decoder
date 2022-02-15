import { BlockchainResources, BlockchainRpcCaller, Transaction } from '../model/common.model';
import { BigNumber } from '@ethersproject/bignumber';
import { UniswapV3TxDecoder } from '../decoders/swap/uniswap/uniswap-v3-tx.decoder';

const fetch = require('node-fetch');

const nodeUrl = 'SET_YOUR_NODE_URL';
const chainId = 1;



describe('OinchTxDecoder integration test', () => {
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
        uniswapV3TxDecoder = new UniswapV3TxDecoder(resources, rpcCaller);
    });

    it('decodeTxByEstimation()', async () => {
        const tx: Transaction = {
            data: '0xac9650d800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000104414bf389000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000001f400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000061ec75470000000000000000000000000000000000000000000000000000000082316dc50000000000000000000000000000000000000000000000000c91e449c32e94e6000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c0000000000000000000000000000000000000000000000000c91e449c32e94e60000000000000000000000008c121aea8ae7cda4c207975e4b3546b95b94229e00000000000000000000000000000000000000000000000000000000',
            from: '0x8C121aEA8ae7CdA4c207975E4B3546B95b94229e',
            gasLimit: BigNumber.from('223816'),
            gasPrice: BigNumber.from('136346789964'),
            to: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            value: '0'
        };
        const result = await uniswapV3TxDecoder.decodeByConfig(tx);

        expect(result).toBeDefined()
    });
});
