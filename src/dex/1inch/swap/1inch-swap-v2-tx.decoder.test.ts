import {BigNumber} from 'ethers';
import {
    SwapExactInputPayload,
    SwapThroughPoolPayload,
} from '../../../core/transaction-parsed/swap-payload';
import PoolService from '../pools/pool.service';
import { Web3Service } from '../../../helpers/web3/web3.service';
import {TransactionParsed} from '../../../core/transaction-parsed';
import {TransactionRaw} from '../../../core/transaction-raw';
import {TransactionType} from '../../../core/transaction-type';
import {decode1InchSwapV4} from './1inch-swap-v2-tx.decoder';

const nodeUrl = 'https://web3-node-private.1inch.exchange/';

describe('decode1InchSwapV4', () => {
    let poolService: PoolService;

    beforeAll(() => {
        const web3Svc = new Web3Service(nodeUrl);
        poolService = new PoolService(web3Svc);
    });


    // https://etherscan.io/tx/0xc8ca8e6f65e3885f2d925f33aae797bbe6d61cafb22853ecc4c803c10a101e44
    it('clipperSwap', async () => {
        const tx: TransactionRaw = {
            data: '0xb04311820000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000053444835ec5800000000000000000000000000000000000000000000000000000000000405b9c6efe26b9977',
            from: '0x346f1d297c98c28574742b067b67a80cda2dc0d9',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0',
        };
        const result = await decode1InchSwapV4(
            poolService,
            '0x1111111254fb6c44bac0bed2854e76f90643097d',
            tx
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.SwapExactInput;
            payload: SwapExactInputPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.SwapExactInput);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            srcTokenAddress: '0x0000000000000000000000000000000000000000',
            dstTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            srcAmount: '6000000000000000000',
            minDstAmount: '17275930351',
        });
    });

    // https://etherscan.io/tx/0x8294453b09734e39830edec57486e4622170618819c1250ec5a93d0816c58f0d
    it('unoswap', async () => {
        const tx: TransactionRaw = {
            data: '0x2e95b6c80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000027f7d0bdb9200000000000000000000000000000000000000000000000000001edc738f266bdd090000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b6d0340c0bf97bffa94a50502265c579a3b7086d081664be26b9977',
            from: '0x83664b8a83b9845ac7b177df86d0f5bf3b7739ad',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0',
        };
        const result = await decode1InchSwapV4(
            poolService,
            '0x1111111254fb6c44bac0bed2854e76f90643097d',
            tx
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.SwapExactInput;
            payload: SwapExactInputPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.SwapExactInput);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            srcTokenAddress: '0x0000000000000000000000000000000000000000',
            dstTokenAddress:'0x990f341946a3fdb507ae7e52d17851b87168017c',
            srcAmount: '180000000000000000',
            minDstAmount: '2223779374676303113',
        });
    });

    // https://etherscan.io/tx/0xe970c4f72e5d4a07d4fc52df338e75a082c3b4b835e40d7e4ea2df567b066de3

    it('unoswapWithPermit', async () => {
        const tx: TransactionRaw = {
            data: '0xa1251d7500000000000000000000000019042021329fddcfbea5f934fb5b2670c91f7d2000000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000000cbe1e61c676400000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000140000000000000003b6d0340ec9eb7af42207a8da12a04ee4b2f2b4b9cb43bd500000000000000000000000000000000000000000000000000000000000000e00000000000000000000000003b608c5243732903152e38f1dab1056a4a79b9800000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000618d1e72000000000000000000000000000000000000000000000000000000000000001bb71d754ebc94ea2fe86bd06f941b4607b58433d29a4bded6f42c9ea789e997cc161711ec3aa97cc6af741c0f3e804398198db0d50f701fe42889509a5e0d8fb9e26b9977',
            from: '0x3b608c5243732903152e38f1dab1056a4a79b980',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0',
        };
        const result = await decode1InchSwapV4(
            poolService,
            '0x1111111254fb6c44bac0bed2854e76f90643097d',
            tx
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.SwapExactInput;
            payload: SwapExactInputPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.SwapExactInput);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            srcTokenAddress: '0x19042021329fddcfbea5f934fb5b2670c91f7d20',
            dstTokenAddress:'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            srcAmount: '100000',
            minDstAmount: '224171088701284',
        });
    });

    // https://etherscan.io/tx/0x7b0566eeb04ef09692e3f903d2819e9adf8f9f1ee11cdb824500343750df0347
    it('swap', async () => {
        const tx: TransactionRaw = {
            data: '0x7c025200000000000000000000000000220bda5c8994804ac96ebe4df184d25e5c2196d400000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000180000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000220bda5c8994804ac96ebe4df184d25e5c2196d40000000000000000000000005ac06ac7f18c7bc6bcde4df2010accd03cc76efd000000000000000000000000000000000000000000000000c249fdd327780000000000000000000000000000000000000000000000000000000000091a8de5e20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cc00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000004e000000000000000000000000000000000000000000000000000000000000007a00000000000000000000000000000000000000000000000000000000000000a80000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000c249fdd32778000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004d0e30db0000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064eb5625d9000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c8000000000000000000000000000000000000000000000000c249fdd32778000000000000000000000000000000000000000000000000000000000000800000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001e452bbbe2900000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000220bda5c8994804ac96ebe4df184d25e5c2196d40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000220bda5c8994804ac96ebe4df184d25e5c2196d400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000006222387990291319f1d4ea3ad4db0dd8fe9e12baf749e84500020000000000000000013c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000956f47f50a910163d8bf957cf5846d573e7f87ca000000000000000000000000000000000000000000000000c249fdd32778000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000022414284aab00000000000000000000000000000000000000000000000000000000000000808000000000000000000000000000000000000000000000000000000000000044000000000000000000000000956f47f50a910163d8bf957cf5846d573e7f87ca0000000000000000000000000000003200000000000000000000000000000032800000000000000000000000df50fbde8180c8785842c8e316ebe06f542d3443000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000104128acb08000000000000000000000000220bda5c8994804ac96ebe4df184d25e5c2196d40000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000001000276a400000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000956f47f50a910163d8bf957cf5846d573e7f87ca000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000024432ce0a7c00000000000000000000000000000000000000000000000000000000000000808000000000000000000000000000000000000000000000000000000000000044000000000000000000000000220bda5c8994804ac96ebe4df184d25e5c2196d400000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a405971224000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000050f788d09395724777a67dd08be127cf70dd2380000000000000000000000000000000000000000000000000000000000000001000000000000000002c248de9888696900000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004470bdb947000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000009321861be0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000016414284aab00000000000000000000000000000000000000000000000000000000000000808000000000000000000000000000000000000000000000000000000000000024000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000100000000000000000000000000000001000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e26b9977',
            from: '0x5ac06ac7f18c7bc6bcde4df2010accd03cc76efd',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0',
        };
        const result = await decode1InchSwapV4(
            poolService,
            '0x1111111254fb6c44bac0bed2854e76f90643097d',
            tx
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.SwapExactInput;
            payload: SwapExactInputPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.SwapExactInput);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            srcTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            dstTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            srcAmount: '14000000000000000000',
            minDstAmount: '39100212706',
        });
    });

    // https://etherscan.io/tx/0xb7d5433274706670d52e68eabf49c0cd56c57ec8f336d520838d2552da01b329
    it('uniswapV3Swap', async () => {
        const tx: TransactionRaw = {
            data: '0xe449022e0000000000000000000000000000000000000000000000000000002098a67800000000000000000000000000000000000000000000000002c75d7a94a6a716300000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000120000000000000000000000088e6a0c2ddd26feeb64f039a2c41296fcb3f5640e26b9977',
            from: '0xdcb01cee36a2c3fb31457be81916bd20141dfccd',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0',
        };

        const result = await decode1InchSwapV4(
            poolService,
            '0x1111111254fb6c44bac0bed2854e76f90643097d',
            tx
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.SwapThroughPool;
            payload: SwapThroughPoolPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.SwapExactInput);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            srcTokenAddress:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            dstTokenAddress:'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            srcAmount: '140000000000',
            minDstAmount: '51259261312670570032',
        });
    });

    // https://etherscan.io/tx/0xa378ad47a20ef42a3c8cd7f898fe96c5cfb6a06fd9be8570a19f2e1bc9c3c652
    it('uniswapV3SwapToWithPermit', async () => {
        const tx: TransactionRaw = {
            data: '0x2521b9300000000000000000000000005136cdfc4d2b1a74774f5137095f82f88af5ec99000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000022d6df4390000000000000000000000000000000000000000000000002f185e8000b83a9100000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000120000000000000000000000088e6a0c2ddd26feeb64f039a2c41296fcb3f564000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000005136cdfc4d2b1a74774f5137095f82f88af5ec990000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000062224c37000000000000000000000000000000000000000000000000000000000000001b20aec56d86c636ea7bab18a9c7986aaed30a5f3b5337e25df6fcd52a10fb27a737dd3b5d9aefa47641e0955bd71d0a2cbee8f51d5450befadd1e1a00bdad818fe26b9977',
            from: '0x5136cdfc4d2b1a74774f5137095f82f88af5ec99',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            value: '0',
        };

        const result = await decode1InchSwapV4(
            poolService,
            '0x1111111254fb6c44bac0bed2854e76f90643097d',
            tx
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.SwapThroughPool;
            payload: SwapThroughPoolPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.SwapExactInput);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            srcTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            dstTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            srcAmount: '9352115257',
            minDstAmount: '3393566223084567185',
        });
    });
});
