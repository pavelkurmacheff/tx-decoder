import { TransactionRaw } from "src/core/transaction-raw";
import { TransactionRich } from "src/core/transaction-rich";
import { ehtTransactionDecoder } from "./eth-transaction-decoder";
import { NormalizationService } from "./normalization.service";

class EthTransactionParser {
    constructor(private norm: NormalizationService){}

    async parse(tx: TransactionRaw): Promise<TransactionRich> {
        const parsed = ehtTransactionDecoder(tx);
        switch(parsed.tag) {
            case 'Success':
                return this.norm.normalize(parsed.tx);
                
            case 'AnotherContract':
            case 'NotSupported':
            case 'WrongContractCall':
                throw 'TODO';
        }
    }
}