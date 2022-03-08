import {TransactionParsed} from 'src/core/transaction-parsed/transaction-parsed';
import {TransactionRaw} from 'src/core/transaction-raw';

export type DecodeResult<Tx = TransactionParsed> =
    | {tag: 'AnotherContract'}
    | {tag: 'WrongContractCall'}
    | {tag: 'NotSupported'; funcName: string}
    | {tag: 'Success'; tx: Tx};

export type TxDecoder = (tx: TransactionRaw) => DecodeResult | Promise<DecodeResult>;

export function combineTxDecoders(decoders: TxDecoder[]): TxDecoder {
    return async (tx) => {
        let res: DecodeResult | null = null;
        for (const d of decoders) {
            if (res != null) {
                break;
            }

            let decodeRes: DecodeResult;
            const r = d(tx);
            if(isPromise(r)) {
                decodeRes = await r;
            } else {
                decodeRes = r as DecodeResult;
            }
            switch (decodeRes.tag) {
                case 'AnotherContract':
                    break;
                default:
                    res = decodeRes;
                    break;
            }
        }

        if (res != null) {
            return res;
        }

        return {tag: 'AnotherContract'};
    };
}

function isPromise(promise: any) {  
    return !!promise && typeof promise.then === 'function'
}
