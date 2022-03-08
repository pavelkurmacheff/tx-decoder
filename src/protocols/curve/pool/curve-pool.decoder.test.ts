import { BigNumber } from "ethers";
import { oinctRpcProvider } from "../../../helpers/oinch/1inch-web3-rpc.utils";
import { TransactionRaw } from "../../../core/transaction-raw";
import { decodeCurveLiquidity } from "./curve-pool.decoder";
import { RemoveLiquidityPayload } from "../../../core/transaction-parsed/remove-liquidity-payload";
import { TransactionType } from "../../../core/transaction-type";
import { TransactionParsed } from "../../../core/transaction-parsed";

describe('Curve pool test', () => {
    it('swap via pool (3 coins)', async () => {
        const tx: TransactionRaw = {
            data: '0x394747c50000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000019c60000000000000000000000000000000000000000000000000000000000000001',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            to: '0xD51a44d3FaE010294C616388b506AcdA1bfAAE46',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            value: '30000000000000000'
        };

        const result = await decodeCurveLiquidity(oinctRpcProvider, tx);
        expect(result.tag).toEqual('Success');
        expect((result as any).tx.payload.dstTokenAddress).toEqual('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599');
    });

    it('swap via pool (2 coins)', async () => {
        const tx: TransactionRaw = {
            data: '0x3df021240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000005af3107a400000000000000000000000000000000000000000000000000000005a51ad8e1ded',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            to: '0xC4C319E2D4d66CcA4464C0c2B32c9Bd23ebe784e',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            value: '30000000000000000'
        };

        const result = await decodeCurveLiquidity(oinctRpcProvider, tx);
        expect(result.tag).toEqual('Success');
        expect((result as any).tx.payload.dstTokenAddress).toEqual('0x0100546F2cD4C9D97f798fFC9755E47865FF7Ee6');
    });

    it('add liquidity to pool (2 coins)', async () => {
        const tx: TransactionRaw = {
            data: '0x0b4c7e4d000000000000000000000000000000000000000000000000021ca135d4d7b80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000217a1691c9ff78f',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            to: '0xC4C319E2D4d66CcA4464C0c2B32c9Bd23ebe784e',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            value: '30000000000000000'
        };

        const result = await decodeCurveLiquidity(oinctRpcProvider, tx);
        expect(result.tag).toEqual('Success');
        expect((result as any).tx.payload.tokenAmount).toHaveLength(2);
    });

    it('remove liquidity from pool (2 coins)', async () => {
        const tx: TransactionRaw = {
            data: '0x269b55810000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            to: '0xB576491F1E6e5E62f1d8F26062Ee822B40B0E0d4',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            value: '30000000000000000'
        };

        const result = await decodeCurveLiquidity(oinctRpcProvider, tx);
        expect(result.tag).toBe('Success');
        
        const parsedTx = (result as {tag: 'Success'; tx: TransactionParsed}).tx as {
            tag: TransactionType.RemoveLiquidity;
            payload: RemoveLiquidityPayload;
        }

        expect(parsedTx.payload.lpAmount).toEqual('0');
    });
});