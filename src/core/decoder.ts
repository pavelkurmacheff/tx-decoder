import { TransactionParsed } from "src/core/transaction-parsed";
import { TransactionRaw } from "src/core/transaction-raw";

export type DecodeResult = 
    { tag: 'AnotherContract' } | 
    { tag: 'WrongContractCall' } | 
    { tag: 'NotSupported', funcName: string } | 
    { tag: 'Success', tx: TransactionParsed }

export type TxDecoder = (tx: TransactionRaw) => DecodeResult;

export function combineTxDecoders(decoders: TxDecoder[]): TxDecoder {
    return tx => {
        let res: DecodeResult | null = null;
        for(const d of decoders) {
            if (res != null) {
                break;
            }

            const r = d(tx);
            switch(r.tag) {
                case 'AnotherContract':
                    break;
                default:
                    res = r;
                    break;
            }
        }

        if(res != null) {
            return res;
        }

        return {tag: 'AnotherContract'};
    }
}