import { DecodeResult } from '../../core/decoder';
import { TransactionType } from '../../core/transaction-type';
import { TransactionRaw } from '../../core/transaction-raw';
import { abiDecoder, getParam } from '../../helpers/abi/abi-decoder.helper';
import { IAbiDecoderResult } from '../../helpers/abi/types';
import ERC20ABI from '../../core/abi/ERC20ABI.json';
import Curve from './CURVE.json';

abiDecoder.addABI(Curve);
abiDecoder.addABI(ERC20ABI);

export function decodeCurve(contractAddr: string, tx: TransactionRaw): DecodeResult {
    if (contractAddr.toUpperCase() != tx.to.toUpperCase()) {
        return { tag: 'AnotherContract' };
    }
    
    const rootFunc: IAbiDecoderResult = abiDecoder.decodeMethod(tx.data);
    const functionInfo = {
        name: rootFunc.name,
        hash: tx.data.slice(0, 10).toLowerCase(),
        params: rootFunc.params,
        abi: Curve,
    };

    switch(rootFunc.name) {
        case 'exchange': {
            const path = getParam(rootFunc, '_route') as string[];
            const dst = path[path.length - 1];
            const minAmount = getParam(rootFunc, '_min_received') as string;

            return { 
                tag: 'Success',
                tx: {
                    tag: TransactionType.SwapExactInput,
                    functionInfo,
                    raw: tx,
                    payload: {
                        srcTokenAddress: 'native',
                        dstTokenAddress: dst,
                        srcAmount: tx.value,
                        minDstAmount: minAmount,
                    }
                }
            };
        }

        default:
            return { tag: 'NotSupported', funcName: rootFunc.name };
    } 
}
