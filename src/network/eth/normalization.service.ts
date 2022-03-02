import { TransactionParsed } from "src/core/transaction-parsed";
import { TransactionRich } from "src/core/transaction-rich";
import { createUnknownToken } from "src/core/transaction-rich/token";
import { TransactionType } from "src/core/transaction-type";
import { CustomTokensService } from "src/helpers/tokens/custom-tokens.service";

export class NormalizationService {
    constructor(private customTokenSvc: CustomTokensService){} 

    async normalize(tx: TransactionParsed): Promise<TransactionRich> {
        switch(tx.tag) {
            case TransactionType.SwapExactInput:
                return this.normalizeSwapExactInput(tx.payload);
            case TransactionType.Approve:
            case TransactionType.Unwrap:
            case TransactionType.SwapExactInput:
            case TransactionType.SwapExactOutput:
            case TransactionType.LimitOrderFill:
            case TransactionType.LimitOrderCancel:
            case TransactionType.Multicall:
            default:
                throw 'TODO';
        }
    }

    private async normalizeSwapExactInput(p: SwapExactInputTx): Promise<TransactionRich> {
        const [srcToken, dstToken] = await Promise.all([
            this.customTokenSvc.getTokenByAddress(p.srcTokenAddress),
            this.customTokenSvc.getTokenByAddress(p.dstTokenAddress),
        ]);

        return {
            tag: TransactionType.SwapExactInput,
            payload: {
                ...p,
                srcToken: srcToken ? srcToken : createUnknownToken(p.srcTokenAddress),
                dstToken: dstToken ? dstToken : createUnknownToken(p.dstTokenAddress),
            }
        }
    }
}