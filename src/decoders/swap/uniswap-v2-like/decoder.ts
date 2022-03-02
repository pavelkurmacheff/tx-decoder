import { Transaction } from "src/model/common.model";
import { Tx } from "./tx-types";

export type DecodeResult = 
    { tag: 'AnotherContract' } | 
    { tag: 'WrongContractCall' } | 
    { tag: 'NotSupported', funcName: string } | 
    { tag: 'Success', tx: Tx }

export type TxDecoder = (tx: Transaction) => DecodeResult;

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