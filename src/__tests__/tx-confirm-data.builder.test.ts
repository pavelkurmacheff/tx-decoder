import {BlockchainRpcCaller, Transaction} from '../model/common.model';
import {TxConfirmDataBuilder} from '../tx-confirm-data.builder';
import {TOKENS_MOCK} from './mocks/tokens.mock';
import {TOKEN_PRICES_MOCK} from './mocks/token-prices.mock';
import {BigNumber} from '@ethersproject/bignumber';
import {TOKEN0_POOL_SELECTOR, TOKEN1_POOL_SELECTOR} from '../common.const';

describe('Transaction data for confirmation builder', () => {
    let txUiItemsBuilder: TxConfirmDataBuilder;
    let rpcCaller: BlockchainRpcCaller;
    let rpcCallerMock: jest.Mock;

    beforeEach(() => {
        rpcCallerMock = jest.fn();
        rpcCaller = {
            call: rpcCallerMock
        };
        txUiItemsBuilder = new TxConfirmDataBuilder({
            tokens: TOKENS_MOCK,
            tokenPrices: TOKEN_PRICES_MOCK
        }, rpcCaller);
    });

    function isDestAmountEstimationCall(
        method: string, params: any[],
        {from, to, data, value}: Transaction
    ): boolean {
        const reqData = params[0];

        return method === 'eth_call'
            && Object.keys(reqData).length === 4
            && reqData.from === from
            && reqData.to === to
            && reqData.data === data
            && reqData.value === value;
    }

    // https://etherscan.io/tx/0xbd44b75afac45ef81af448c47b40d32ac705fe2d0354b39097f5ebfd62046ffe
    it('Approve transaction', async () => {
        const txConfig: Transaction = {
            nonce: 383,
            gasPrice: '0x1da4f97c6e',
            gasLimit: '0x011150',
            from: '0x3b608c5243732903152e38f1dab1056a4a79b980',
            to: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
            value: '0x00',
            data: '0x095ea7b30000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        };

        const {items, txType} = await txUiItemsBuilder.buildItemsForTx(txConfig);

        expect(txType).toBe('approve');
        expect(items).toMatchSnapshot();
    });

    // https://etherscan.io/tx/0x698156119b255c33347bf844a0245dafdc39e871f3825ae5c24cc0019be748ed
    it('Swap transaction: swap()', async () => {
        const dstAmount = BigNumber.from('114241200360986751251430').toHexString();
        const txConfig: Transaction = {
            nonce: 194,
            gasPrice: '0x1b7b430f2c',
            gasLimit: '0x091d06',
            from: '0x64741d0b9e376d75873c12e1b0cdccc26c3bcb04',
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0x00',
            data: '0x7c025200000000000000000000000000220bda5c8994804ac96ebe4df184d25e5c2196d400000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000180000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000853d955acef822db058eb8505911ed77f175b99e000000000000000000000000220bda5c8994804ac96ebe4df184d25e5c2196d400000000000000000000000064741d0b9e376d75873c12e1b0cdccc26c3bcb040000000000000000000000000000000000000000000000000000001aa580321900000000000000000000000000000000000000000000181b5805bbc9ae4bb3e600000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000002808000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064eb5625d9000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000d632f22692fac7611d2aa1c0d552930d43caed3b0000000000000000000000000000000000000000000000000000001aa580321900000000000000000000000000000000000000000000000000000000800000000000000000000000d632f22692fac7611d2aa1c0d552930d43caed3b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000084a6417ed6000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001aa5803219000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000018414284aab00000000000000000000000000000000000000000000000000000000000000808000000000000000000000000000000000000000000000000000000000000044000000000000000000000000853d955acef822db058eb8505911ed77f175b99e00000000000000000000000000000001000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064d1660f99000000000000000000000000853d955acef822db058eb8505911ed77f175b99e0000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e26b9977'
        };

        rpcCallerMock.mockImplementation((method, params) => {
            if (isDestAmountEstimationCall(method, params, txConfig)) {
                return Promise.resolve(dstAmount);
            }

            return Promise.resolve('0x');
        });

        const {items, txType} = await txUiItemsBuilder.buildItemsForTx(txConfig);

        expect(txType).toBe('swap');
        expect(items).toMatchSnapshot();
    });

    // https://etherscan.io/tx/0xd0de097ca15040e588f8528162c01f5cad29fd7ea2168b2a503bc3633a4e8a6b
    it('Swap transaction: clipperSwap()', async () => {
        const dstAmount = BigNumber.from('459483882860783').toHexString();
        const txConfig: Transaction = {
            nonce: 380,
            gasPrice: '0x1eb1f3ba45',
            gasLimit: '0x02c6a2',
            from: '0x3b608c5243732903152e38f1dab1056a4a79b980',
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0x00',
            data: '0xb04311820000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000000018227176f419ee26b9977'
        };

        rpcCallerMock.mockImplementation((method, params) => {
            if (isDestAmountEstimationCall(method, params, txConfig)) {
                return Promise.resolve(dstAmount);
            }

            return Promise.resolve('0x');
        });

        const {items, txType} = await txUiItemsBuilder.buildItemsForTx(txConfig);

        expect(txType).toBe('swap');
        expect(items).toMatchSnapshot();
    });

    // https://etherscan.io/tx/0x027dbf1121f509031eba135ef03a17f18bfa7195c035c73db4cfc94b55df522e
    it('Swap transaction: clipperSwapWithPermit()', async () => {
        const dstAmount = BigNumber.from('425128486899692').toHexString();
        const txConfig: Transaction = {
            nonce: 379,
            gasPrice: '0x1ce84f82b4',
            gasLimit: '0x04191b',
            from: '0x3b608c5243732903152e38f1dab1056a4a79b980',
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0x00',
            data: '0xd6a92a5d0000000000000000000000003b608c5243732903152e38f1dab1056a4a79b980000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e848000000000000000000000000000000000000000000000000000018243f4d027f800000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000003b608c5243732903152e38f1dab1056a4a79b9800000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000618d1d77000000000000000000000000000000000000000000000000000000000000001b8576a8af192b84d1e122d82eeddeb2fd0b006381926590f471fd23247aeeeb09010cad06bbbf7aa344d311a13ed14419a913f2015c88600dbbd579b180bf6d36e26b9977'
        };

        rpcCallerMock.mockImplementation((method, params) => {
            if (isDestAmountEstimationCall(method, params, txConfig)) {
                return Promise.resolve(dstAmount);
            }

            return Promise.resolve('0x');
        });

        const {items, txType} = await txUiItemsBuilder.buildItemsForTx(txConfig);

        expect(txType).toBe('swap');
        expect(items).toMatchSnapshot();
    });

    // https://etherscan.io/tx/0x179a4f63854d6e6f5d18ec1bf31d47c4debb6a7c32a094a815e4c0eeb25f4c2d
    it('Swap transaction: unoswap()', async () => {
        const dstAmount = BigNumber.from('928900907292644').toHexString();
        const txConfig: Transaction = {
            nonce: 385,
            gasPrice: '0x2620214ec7',
            gasLimit: '0x02873c',
            from: '0x3b608c5243732903152e38f1dab1056a4a79b980',
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0x00',
            data: '0x2e95b6c8000000000000000000000000111111111117dc0aa78b770fa6a738034120c3020000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000034bfc51cd56c70000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000140000000000000003b6d034086f518368e0d49d5916e2bd9eb162e9952b7b04de26b9977'
        };

        rpcCallerMock.mockImplementation((method, params) => {
            if (isDestAmountEstimationCall(method, params, txConfig)) {
                return Promise.resolve(dstAmount);
            }

            if (method === 'eth_call' && params[0].data === TOKEN1_POOL_SELECTOR) {
                // WETH
                return Promise.resolve('0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
            }

            return Promise.resolve('0x');
        });

        const {items, txType} = await txUiItemsBuilder.buildItemsForTx(txConfig);

        expect(txType).toBe('swap');
        expect(items).toMatchSnapshot();
    });

    // https://etherscan.io/tx/0xe970c4f72e5d4a07d4fc52df338e75a082c3b4b835e40d7e4ea2df567b066de3
    it('Swap transaction: unoswapWithPermit()', async () => {
        const dstAmount = BigNumber.from('224395484185470').toHexString();
        const txConfig: Transaction = {
            nonce: 381,
            gasPrice: '0x1db6178ec5',
            gasLimit: '0x0343b4',
            from: '0x3b608c5243732903152e38f1dab1056a4a79b980',
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0x00',
            data: '0xa1251d7500000000000000000000000019042021329fddcfbea5f934fb5b2670c91f7d2000000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000000cbe1e61c676400000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000140000000000000003b6d0340ec9eb7af42207a8da12a04ee4b2f2b4b9cb43bd500000000000000000000000000000000000000000000000000000000000000e00000000000000000000000003b608c5243732903152e38f1dab1056a4a79b9800000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000618d1e72000000000000000000000000000000000000000000000000000000000000001bb71d754ebc94ea2fe86bd06f941b4607b58433d29a4bded6f42c9ea789e997cc161711ec3aa97cc6af741c0f3e804398198db0d50f701fe42889509a5e0d8fb9e26b9977'
        };

        rpcCallerMock.mockImplementation((method, params) => {
            if (isDestAmountEstimationCall(method, params, txConfig)) {
                return Promise.resolve(dstAmount);
            }

            if (method === 'eth_call' && params[0].data === TOKEN1_POOL_SELECTOR) {
                // WETH
                return Promise.resolve('0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
            }

            return Promise.resolve('0x');
        });

        const {items, txType} = await txUiItemsBuilder.buildItemsForTx(txConfig);

        expect(txType).toBe('swap');
        expect(items).toMatchSnapshot();
    });

    // https://etherscan.io/tx/0xc0302a2f43cf86c04cfa8c67025da08bbc53372cc313e87ba0d32febff2f517c
    it('Swap transaction: uniswapV3Swap()', async () => {
        const dstAmount = BigNumber.from('237839432511886').toHexString();
        const txConfig: Transaction = {
            nonce: 382,
            gasPrice: '0x222511942d',
            gasLimit: '0x02696f',
            from: '0x3b608c5243732903152e38f1dab1056a4a79b980',
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0x00',
            data: '0xe449022e000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000d818ee8db64e0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000120000000000000000000000073a6a761fe483ba19debb8f56ac5bbf14c0cdad1e26b9977'
        };
        const expectedPoolAddress = '0x73a6a761fe483ba19debb8f56ac5bbf14c0cdad1';

        rpcCallerMock.mockImplementation((method, params) => {
            if (isDestAmountEstimationCall(method, params, txConfig)) {
                return Promise.resolve(dstAmount);
            }

            if (method === 'eth_call'
                && params[0].to === expectedPoolAddress
                && params[0].data === TOKEN0_POOL_SELECTOR) {
                // SUSHI
                return Promise.resolve('0x0000000000000000000000006b3595068778dd592e39a122f4f5a5cf09c90fe2');
            }

            if (method === 'eth_call'
                && params[0].to === expectedPoolAddress
                && params[0].data === TOKEN1_POOL_SELECTOR) {
                // WETH
                return Promise.resolve('0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
            }

            return Promise.resolve('0x');
        });

        const {items, txType} = await txUiItemsBuilder.buildItemsForTx(txConfig);

        expect(txType).toBe('swap');
        expect(items).toMatchSnapshot();
    });

    // https://etherscan.io/tx/0x1b251d13fd530ddf2d4125631c71ee07b56568c1a6cf55a8e53a29a599b81e92
    it('Swap transaction: uniswapV3SwapToWithPermit()', async () => {
        const dstAmount = BigNumber.from('3205160238574434958').toHexString();
        const txConfig: Transaction = {
            nonce: 366,
            gasPrice: '0x161000aa70',
            gasLimit: '0x04734d',
            from: '0x3b608c5243732903152e38f1dab1056a4a79b980',
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0x00',
            data: '0x2521b9300000000000000000000000003b608c5243732903152e38f1dab1056a4a79b980000000000000000000000000111111111117dc0aa78b770fa6a738034120c3020000000000000000000000000000000000000000000000008a720b1faca5b6980000000000000000000000000000000000000000000000002c58db06cc07b86500000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d35efae4097d005720608eaf37e42a5936c94b44800000000000000000000000d1d5a4c0ea98971894772dcd6d2f1dc71083c44e00000000000000000000000000000000000000000000000000000000000000e00000000000000000000000003b608c5243732903152e38f1dab1056a4a79b9800000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000006187dd53000000000000000000000000000000000000000000000000000000000000001cdae2d3851069237b24b459c7c732ce95d1ed8519fa084ab44f167f356c1310134e9f3100eee9ec3d6b3631d82367ea69af53f5a626596da45c6c441749c376d6e26b9977'
        };

        rpcCallerMock.mockImplementation((method, params) => {
            if (isDestAmountEstimationCall(method, params, txConfig)) {
                return Promise.resolve(dstAmount);
            }

            if (method === 'eth_call' && params[0].data === TOKEN0_POOL_SELECTOR) {
                // LQTY
                return Promise.resolve('0x0000000000000000000000006dea81c8171d0ba574754ef6f8b412f2ed88c54d');
            }

            return Promise.resolve('0x');
        });

        const {items, txType} = await txUiItemsBuilder.buildItemsForTx(txConfig);

        expect(txType).toBe('swap');
        expect(items).toMatchSnapshot();
    });
});
