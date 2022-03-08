import { JsonFragment, Fragment } from "@ethersproject/abi";
import { DecodeResult } from '../../../core/decoder';
import { TransactionType } from '../../../core/transaction-type';
import { TransactionRaw } from '../../../core/transaction-raw';
import { abiDecoder, getParam } from '../../../helpers/abi/abi-decoder.helper';
import { IAbiDecoderResult } from '../../../helpers/abi/types';
import Balancer from './BALANCER.json';

abiDecoder.addABI(Balancer as ReadonlyArray<Fragment | JsonFragment | string>);

export function decodeBalancer(contractAddr: string, tx: TransactionRaw): DecodeResult {
    if (contractAddr.toUpperCase() != tx.to.toUpperCase()) {
        return { tag: 'AnotherContract' };
    }
    
    const rootFunc: IAbiDecoderResult = abiDecoder.decodeMethod(tx.data);
    const functionInfo = {
        name: rootFunc.name,
        hash: tx.data.slice(0, 10).toLowerCase(),
        params: rootFunc.params,
        abi: Balancer as ReadonlyArray<Fragment | JsonFragment | string>,
    };

    switch(rootFunc.name) {
        case 'swap': {
            const singleSwap = getParam(rootFunc, 'singleSwap') as string[];
            // const funds = getParam(rootFunc, 'funds') as string[];
            // const limit = getParam(rootFunc, 'limit') as string;
            // const deadline = getParam(rootFunc, 'deadline') as string;

            // const poolId = singleSwap[0];
            // const kind = singleSwap[1];
            const assetIn = singleSwap[2];
            const assetOut = singleSwap[3];
            // const amount = singleSwap[4];
            // const userData = singleSwap[5];

            return { 
                tag: 'Success',
                tx: {
                    tag: TransactionType.SwapExactInput,
                    functionInfo,
                    raw: tx,
                    payload: {
                        srcTokenAddress: assetIn,
                        dstTokenAddress: assetOut,
                        srcAmount: tx.value,
                        // minDstAmount: minAmount,
                    }
                }
            };
        }

        default:
            return { tag: 'NotSupported', funcName: rootFunc.name };
    } 
}
