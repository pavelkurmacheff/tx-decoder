import {
    MulticallPayload,
    TransactionParsed,
} from '../../core/transaction-parsed';
import {
    MulticallPayloadRich,
    TransactionRich,
} from '../../core/transaction-rich';
import {createUnknownToken, Token} from '../../core/token';
import {TransactionType} from '../../core/transaction-type';
import {CustomTokensService} from '../../helpers/tokens/custom-tokens.service';
import {LimitOrderFillPayload} from '../../core/transaction-parsed/limit-order-fill-payload';
import {ApproveTxPayload} from '../../core/transaction-parsed/approve-payload';
import {ApproveRichTxPayload} from '../../core/transaction-rich/approve-rich-payload';
import {
    SwapExactInputRich,
    SwapExactOutputRich,
} from '../../core/transaction-rich/swap-payload';
import {LimitOrderFillRich} from '../../core/transaction-rich/limit-order-fill';
import {
    SwapExactInputPayload,
    SwapExactOutputPayload,
} from '../../core/transaction-parsed/swap-payload';
import {ValueRichTxPayload} from '../../core/transaction-rich/value-rich-payload';
import {ValueTxPayload} from '../../core/transaction-parsed/value-payload';
import {TransferRichTxPayload} from '../../core/transaction-rich/transfer-rich-payload';
import {TransferTxPayload} from '../../core/transaction-parsed/transfer-payload';
import { ChainTokenByNetwork } from '../../core/const/common.const';
import { AddLiquidityPayload } from '../../core/transaction-parsed/add-liquidity-payload';
import { AddLiquidityRichPayload } from '../../core/transaction-rich/add-liquidity-rich-payload';

export class NormalizationService {
    constructor(private customTokenSvc: CustomTokensService) {}

    async normalize(tx: TransactionParsed): Promise<TransactionRich> {
        switch (tx.tag) {
            case TransactionType.Approve:
                return {
                    ...tx,
                    payload: await this.normalizeApprove(tx.payload),
                };
            case TransactionType.Withdraw:
            case TransactionType.Deposit: {
                return {
                    ...tx,
                    payload: await this.normalizeValue(tx.payload),
                };
            }
            case TransactionType.Transfer: {
                return {
                    ...tx,
                    payload: await this.normalizeTransfer(tx.payload),
                };
            }
            case TransactionType.Unwrap:
                return tx;
            case TransactionType.SwapExactInput:
                return {
                    ...tx,
                    payload: await this.normalizeSwapExactInput(tx.payload),
                };
            case TransactionType.SwapExactOutput:
                return {
                    ...tx,
                    payload: await this.normalizeSwapExactOutput(tx.payload),
                };
            case TransactionType.LimitOrderFill:
                return {
                    ...tx,
                    payload: await this.normalizeLimitOrderFill(tx.payload),
                };
            case TransactionType.LimitOrderCancel:
                return tx;
            case TransactionType.Multicall:
                return {
                    ...tx,
                    payload: await this.normalizeMulticall(tx.payload),
                };
            case TransactionType.AddLiquidity:
                return {
                    ...tx,
                    payload: await this.normalizeAddLiquidity(tx.payload),
                };
            case TransactionType.RemoveLiquidity:
                return {
                    ...tx,
                };
        }
    }

    private async normalizeApprove(
        p?: ApproveTxPayload
    ): Promise<ApproveRichTxPayload | undefined> {
        if (!p) {
            return undefined;
        } else {
            const t = await this.getToket(p.tokenAddress);
            const token = t ? t : createUnknownToken(p.tokenAddress);
            return {...p, token};
        }
    }

    private async normalizeSwapExactInput(
        p: SwapExactInputPayload
    ): Promise<SwapExactInputRich> {
        const [srcToken, dstToken] = await Promise.all([
            this.getToket(p.srcTokenAddress),
            this.getToket(p.dstTokenAddress),
        ]);

        return {
            ...p,
            srcToken: srcToken
                ? srcToken
                : createUnknownToken(p.srcTokenAddress),
            dstToken: dstToken
                ? dstToken
                : createUnknownToken(p.dstTokenAddress),
        };
    }

    private async normalizeSwapExactOutput(
        p: SwapExactOutputPayload
    ): Promise<SwapExactOutputRich> {
        const [srcToken, dstToken] = await Promise.all([
            this.getToket(p.srcTokenAddress),
            this.getToket(p.dstTokenAddress),
        ]);

        return {
            ...p,
            srcToken: srcToken
                ? srcToken
                : createUnknownToken(p.srcTokenAddress),
            dstToken: dstToken
                ? dstToken
                : createUnknownToken(p.dstTokenAddress),
        };
    }

    private async normalizeLimitOrderFill(
        p: LimitOrderFillPayload
    ): Promise<LimitOrderFillRich> {
        const [srcToken, dstToken] = await Promise.all([
            this.getToket(p.srcTokenAddress),
            this.getToket(p.dstTokenAddress),
        ]);

        return {
            ...p,
            srcToken: srcToken
                ? srcToken
                : createUnknownToken(p.srcTokenAddress),
            dstToken: dstToken
                ? dstToken
                : createUnknownToken(p.dstTokenAddress),
        };
    }

    private async normalizeMulticall(
        p: MulticallPayload
    ): Promise<MulticallPayloadRich> {
        const ps = p.map((i) => {
            switch (i.tag) {
                case 'Error':
                    return Promise.resolve(i);
                default:
                    return this.normalize(i as TransactionParsed);
            }
        });
        const payload = await Promise.all(ps);
        return payload;
    }

    private async getToket(
        tokenAddr: string | 'native'
    ): Promise<Token | null> {
        if (tokenAddr == 'native') {
            return ChainTokenByNetwork[this.customTokenSvc.chainId];
        } else {
            return this.customTokenSvc.getTokenByAddress(tokenAddr);
        }
    }

    private async normalizeValue(
        p: ValueTxPayload
    ): Promise<ValueRichTxPayload> {
        const token = await this.getToket(p.tokenAddress);

        return {
            ...p,
            token: token ? token : createUnknownToken(p.tokenAddress),
        };
    }

    private async normalizeTransfer(
        p: TransferTxPayload
    ): Promise<TransferRichTxPayload> {
        const token = await this.getToket(p.tokenAddress);

        return {
            ...p,
            token: token ? token : createUnknownToken(p.tokenAddress),
        };
    }

    private async normalizeAddLiquidity(
        p: AddLiquidityPayload
    ): Promise<AddLiquidityRichPayload> {
        const tokens: (Token | null)[] = await Promise.all(p.tokenAmount.map(t => this.getToket(t.token)));
        const notNullTokens: Token[] = tokens.map((t, i) => t ? t : createUnknownToken(p.tokenAmount[i].token));
        const zipped = p.tokenAmount.map((t, i) => ({ ...t, token: notNullTokens[i] }));

        return {
            ...p,
            tokenAmount: zipped,
        };
    }
}
