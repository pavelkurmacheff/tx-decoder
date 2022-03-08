import {BigNumber} from 'ethers';
import {ApproveTxPayload} from 'src/core/transaction-parsed/approve-payload';
import {TransferTxPayload} from 'src/core/transaction-parsed/transfer-payload';
import {TransactionParsed} from '../../core/transaction-parsed';
import {TransactionRaw} from '../../core/transaction-raw';
import {TransactionType} from '../../core/transaction-type';
import {decodeERC20Token} from './erc20-token-tx.decoder';

describe('decodeERC20Token', () => {
    // https://etherscan.io/tx/0xee2965756d15a22c6890e9d88ea9858b679cb0cd59d7e44285fddb3a6de94e51
    it('approve on weth', async () => {
        const tx: TransactionRaw = {
            data: '0x095ea7b3000000000000000000000000e5c783ee536cf5e63e792988335c4255169be4e1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            from: '0x479060ca88885a87ee9e2e76cbeb86bc2b7995ec',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '0',
        };
        const result = decodeERC20Token(
            tx,
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.Approve;
            payload: ApproveTxPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.Approve);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            toWhomAddress: '0xe5c783ee536cf5e63e792988335c4255169be4e1',
            tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        });
    });

    // https://etherscan.io/tx/0xeb112633e06db05d52c7634e23575cac0d6c730ecc428ec6f93776826ae8f523
    it('transfer on weth', async () => {
        const tx: TransactionRaw = {
            data: '0xa9059cbb00000000000000000000000028c6c06298d514db089934071355e5743bf21d6000000000000000000000000000000000000000000000000000870d88167de000',
            from: '0xe7c810c68e6d297bf31fa3f815dbe10143d4f1ce',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '0',
        };
        const result = decodeERC20Token(
            tx,
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.Transfer;
            payload: TransferTxPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.Transfer);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            srcAddress: '0xe7c810c68e6d297bf31fa3f815dbe10143d4f1ce',
            dstAddress: '0x28c6c06298d514db089934071355e5743bf21d60',
            tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '38014000000000000',
        });
    });

    // https://etherscan.io/tx/0x0a469d9e2ce03a3fcc8ad80596b1ac1159612d6a0fbdc2c4165c27b4f5bd4ef1
    it('transferFrom on weth', async () => {
        const tx: TransactionRaw = {
            data: '0x23b872dd000000000000000000000000e451c6da302847ee4c29a3940b7fd6bfa808b2f7000000000000000000000000158c2406d5ba83f9019398753c1b4af1a61819b600000000000000000000000000000000000000000000000000f8b0a10e470000',
            from: '0xb8b5e97cd110406b692ce756e2818b88b2751fbc',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '0',
        };
        const result = decodeERC20Token(
            tx,
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.Transfer;
            payload: TransferTxPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.Transfer);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            srcAddress: '0xe451c6da302847ee4c29a3940b7fd6bfa808b2f7',
            dstAddress: '0x158c2406d5ba83f9019398753c1b4af1a61819b6',
            tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '70000000000000000',
        });
    });
});
