import { DecodeResult } from '../../../core/decoder';
import { TransactionType } from '../../../core/transaction-type';
import { TransactionRaw } from '../../../core/transaction-raw';
import { abiDecoder, getParam } from '../../../helpers/abi/abi-decoder.helper';
import { IAbiDecoderResult } from '../../../helpers/abi/types';
import Curve2 from './CURVE_POOL_2.json';
import Curve3 from './CURVE_POOL_3.json';
import Curve4 from './CURVE_POOL_4.json';
import { Interface } from 'ethers/lib/utils';
import { JsonRpcProvider } from '@ethersproject/providers';

abiDecoder.addABI(Curve2);
abiDecoder.addABI(Curve3);
abiDecoder.addABI(Curve4);

export async function decodeCurveLiquidity(rpc: JsonRpcProvider, tx: TransactionRaw): Promise<DecodeResult> {
    const rootFunc: IAbiDecoderResult = abiDecoder.decodeMethod(tx.data);
    const functionInfo = {
        name: rootFunc.name,
        hash: tx.data.slice(0, 10).toLowerCase(),
        params: rootFunc.params,
        abi: Curve2,
    };

    switch(rootFunc.name) {
        case 'exchange': {
            const i = getParam(rootFunc, 'i') as string | null;
            const j = getParam(rootFunc, 'j') as string | null;
            const dx = getParam(rootFunc, 'dx') as string | null;
            const minDy = getParam(rootFunc, 'min_dy') as string | null;

            if (!i || !j || !dx || !minDy) {
                return { tag: 'AnotherContract' };
            }

            const iTokenAddr = await getPoolTokenAddr(rpc, tx.to, i);
            const jTokenAddr = await getPoolTokenAddr(rpc, tx.to, j);

            return { 
                tag: 'Success',
                tx: {
                    tag: TransactionType.SwapExactInput,
                    functionInfo,
                    raw: tx,
                    payload: {
                        srcTokenAddress: iTokenAddr,
                        dstTokenAddress: jTokenAddr,
                        srcAmount: dx,
                        minDstAmount: minDy,
                    }
                }
            };
        }

        case 'add_liquidity': {
            const amounts = getParam(rootFunc, '_amounts') as string[] | null;
            const minMints = getParam(rootFunc, '_min_mint_amount') as string | null;

            const amounts2 = getParam(rootFunc, 'amounts') as string[] | null;
            const minMints2 = getParam(rootFunc, 'min_mint_amount') as string | null;

            if ((!amounts || !minMints) && (!amounts2 || !minMints2)) {
                return { tag: 'AnotherContract' };
            }

            const a = (amounts ?? amounts2) as string[];
            // const m = minMints ?? minMints2;

            const tokenAddresses: string[] = 
                await Promise.all(a.map((_, i) => getPoolTokenAddr(rpc, tx.to, i.toString())));
            const mapping = a.map((a, i) => ({token: tokenAddresses[i], amount: a}));

            return { 
                tag: 'Success',
                tx: {
                    tag: TransactionType.AddLiquidity,
                    functionInfo,
                    raw: tx,
                    payload: {
                        tokenAmount: mapping
                    }
                }
            };
        }
        case 'remove_liquidity': {
            throw 'TODO';
        }
        
        default:
            return { tag: 'NotSupported', funcName: rootFunc.name };
    } 
}

async function getPoolTokenAddr(rpc: JsonRpcProvider, poolAddr: string, index: string): Promise<string> {
    const iface = new Interface([
        'function coins(uint256 i) view returns (address)'
    ]);
    const coinsFunc = iface.getFunction('coins(uint256)');
    const callData = iface.encodeFunctionData(coinsFunc, [index]);
    const tx = {
        data: callData,
        from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
        to: poolAddr,
        value: '0x0'
    };
    const r = await rpc.call(tx);
    const res = iface.decodeFunctionResult(coinsFunc, r);
    return res[0];
}