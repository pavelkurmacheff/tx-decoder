import {BigNumber} from 'ethers';
import {SwapExactInputPayload} from 'src/core/transaction-parsed/swap-payload';
import {TransactionParsed} from '../../../core/transaction-parsed';
import {TransactionRaw} from '../../../core/transaction-raw';
import {TransactionType} from '../../../core/transaction-type';
import {decode1InchSwapV4} from './1inch-swap-v2-tx.decoder';

describe('decode1InchSwapV4', () => {
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
        const result = (await decode1InchSwapV4(
            '0x1111111254fb6c44bac0bed2854e76f90643097d',
            tx
        )) as {tag: 'Success'; tx: TransactionParsed};

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
        const result = (await decode1InchSwapV4(
            '0x1111111254fb6c44bac0bed2854e76f90643097d',
            tx
        )) as {tag: 'Success'; tx: TransactionParsed};

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
});
