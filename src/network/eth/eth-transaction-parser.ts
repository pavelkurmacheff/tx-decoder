import { TransactionRaw } from "src/core/transaction-raw";
import { TransactionRich } from "src/core/transaction-rich";
import { ChainId } from "../../core/chain-id";
import { Token } from "../../core/token";
import { CustomTokensService } from "../../helpers/tokens/custom-tokens.service";
import { Web3Service } from "../../helpers/web3/web3.service";
import { loadTokensMap } from "../../helpers/oinch/1inch.utils";
import { EhtTransactionDecoder } from "./eth-transaction-decoder";
import { NormalizationService } from "./normalization.service";

export class EthTransactionParser {
    readonly decoder: EhtTransactionDecoder;
    readonly normSvc: NormalizationService;

    private constructor(result: Map<string, Token>, nodeUrl: string) {
        const web3Svc = new Web3Service(nodeUrl);
        const tokesSvc = new CustomTokensService(result, web3Svc, ChainId.Ethereum);
        this.decoder = new EhtTransactionDecoder(nodeUrl);
        this.normSvc = new NormalizationService(tokesSvc);
    }

    static async create(nodeUrl = 'https://web3-node-private.1inch.exchange/'): Promise<EthTransactionParser> {
        const result = await loadTokensMap(ChainId.Ethereum);
        return new EthTransactionParser(result, nodeUrl);
    }

    async parse(tx: TransactionRaw): Promise<TransactionRich> {
        const parsed = await this.decoder.decode(tx);
        switch(parsed.tag) {
            case 'Success':
                return this.normSvc.normalize(parsed.tx);
                
            case 'AnotherContract':
            case 'NotSupported':
            case 'WrongContractCall':
                throw 'TODO';
        }
    }
}