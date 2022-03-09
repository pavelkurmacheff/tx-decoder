import {BigNumber} from 'ethers';
import {TransactionParsed} from '../../core/transaction-parsed/transaction-parsed';
import {TransactionRaw} from '../../core/transaction-raw';
import {TransactionType} from '../../core/transaction-type';
import {decodeWrappedERC20Token} from './erc20-token-tx.decoder';
import {ValueTxPayload} from '../../core/transaction-parsed/payloads/value-payload'

describe('decodeERC20Token', () => {
    // https://etherscan.io/tx/0xee2965756d15a22c6890e9d88ea9858b679cb0cd59d7e44285fddb3a6de94e51
    it('deposit on weth', async () => {
        const tx: TransactionRaw = {
            data: '0xd0e30db0',
            from: '0xaf944eec87585d186a5b77e14909a53610a20e59',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '1000000000000000000',
        };
        const result = decodeWrappedERC20Token(
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            tx
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.Wrap;
            payload: ValueTxPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.Wrap);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '1000000000000000000',
        });
    });

    // https://etherscan.io/tx/0x162dbf178b8a222c71085f82f8470130a58486b61386dfdbf9f5e0f5291e5a86
    it('withdraw on weth', async () => {
        const tx: TransactionRaw = {
            data: '0x2e1a7d4d0000000000000000000000000000000000000000000000000102212249ceccfa',
            from: '0xab9335ab722a7beba43dcbe15d8b8e131e82f63a',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '0',
        };
        const result = decodeWrappedERC20Token(
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            tx
        ) as {tag: 'Success'; tx: TransactionParsed};

        expect(result).toBeDefined();
        expect(result.tag).toBe('Success');

        const parsedTx = result.tx as {
            tag: TransactionType.Unwrap;
            payload: ValueTxPayload;
        };

        expect(parsedTx.tag).toBe(TransactionType.Unwrap);
        expect(parsedTx.payload).toBeDefined();

        expect(parsedTx.payload).toEqual({
            tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            value: '72656975142243578',
        });
    });
});
