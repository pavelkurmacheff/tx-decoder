/* eslint-disable max-len */
import { BigNumber } from "ethers";
import { TransactionRaw } from "../../../core/transaction-raw";
import { decodeCurveLiquidity } from "./curve-liquidity.decoder";

describe('Curve liquidity test', () => {
    it('Add liquidity', () => {
        const tx: TransactionRaw = {
            data: '0x394747c50000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000019c60000000000000000000000000000000000000000000000000000000000000001',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            to: '0xD51a44d3FaE010294C616388b506AcdA1bfAAE46',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            value: '30000000000000000'
        };

        const result = decodeCurveLiquidity(tx);
        expect(result.tag).toEqual('Success');
        expect((result as any).tx.payload.dstTokenAddress).toEqual('0x6b175474e89094c44da98b954eedeac495271d0f');
    });

});