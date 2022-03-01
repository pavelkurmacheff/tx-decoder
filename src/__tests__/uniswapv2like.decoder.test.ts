import { BigNumber } from "ethers";
import { Transaction } from "../model/common.model";
import { decodePancake } from "../decoders/swap/uniswap-v2-like/uniswap-v2-tx.decoder";

describe('UniswapV2TxDecoder test (pancakeswap)', () => {
    it('Swap native to custom', async () => {
        const tx: Transaction = {
            data: '0x7ff36ab50000000000000000000000000000000000000000000000004182759eff74bf7300000000000000000000000000000000000000000000000000000000000000800000000000000000000000006e797b975b99a20d539786e5c4a32218a3d6d80e00000000000000000000000000000000000000000000000000000000621d3e490000000000000000000000000000000000000000000000000000000000000002000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000000000000000000000000e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            value: '30000000000000000'
        };

        const result = decodePancake(tx);
        expect(result.tag).toEqual('Success');
        expect((result as any).dstTokenAddress).toEqual('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82');

    });

    it('Activate custom token', async () => {
        const tx: Transaction = {
            data: '0x095ea7b300000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            value: '30000000000000000'
        };

        const result = decodePancake(tx);
        expect(result.tag).toEqual('Activation');
    });

    it('Swap custom to custom', async () => {
        const tx: Transaction = {
            data: '0x38ed17390000000000000000000000000000000000000000000000000125448f32d42c000000000000000000000000000000000000000000000000000011effb4f618c7200000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006e797b975b99a20d539786e5c4a32218a3d6d80e00000000000000000000000000000000000000000000000000000000621d5ea900000000000000000000000000000000000000000000000000000000000000030000000000000000000000008f0528ce5ef7b51152a59745befdd91d97091d2f0000000000000000000000007130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c0000000000000000000000000e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            value: '30000000000000000'
        };

        const result = decodePancake(tx);
        expect(result.tag).toEqual('Success');
        expect((result as any).dstTokenAddress).toEqual('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82');
        expect((result as any).srcTokenAddress).toEqual('0x8f0528ce5ef7b51152a59745befdd91d97091d2f');
    });

    it('Swap custom to native', async () => {
        const tx: Transaction = {
            data: '0x18cbafe50000000000000000000000000000000000000000000000000125448f32d42c0000000000000000000000000000000000000000000000000000004f4eb8aadd7100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006e797b975b99a20d539786e5c4a32218a3d6d80e00000000000000000000000000000000000000000000000000000000621d661a00000000000000000000000000000000000000000000000000000000000000030000000000000000000000008f0528ce5ef7b51152a59745befdd91d97091d2f0000000000000000000000007130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            value: '30000000000000000'
        };

        const result = decodePancake(tx);
        expect(result.tag).toEqual('Success');
        expect((result as any).srcTokenAddress).toEqual('0x8f0528ce5ef7b51152a59745befdd91d97091d2f');
    });
});