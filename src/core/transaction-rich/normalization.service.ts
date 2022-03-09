import {
    MulticallPayload,
    TransactionParsed,
} from '../transaction-parsed/transaction-parsed';
import {MulticallPayloadRich, TransactionRich} from './transaction-rich';
import {createUnknownToken, Token} from '../token';
import {TransactionType} from '../transaction-type';
import {CustomTokensService} from '../../helpers/tokens/custom-tokens.service';
import {ApproveRichTxPayload} from './payloads/approve-rich-payload';
import {
    SwapExactInputRichPayload,
    SwapExactOutputRichPayload,
} from './payloads/swap-payload';
import {LimitOrderFillRichPayload} from './payloads/limit-order-fill-rich-payload';
import {ValueRichTxPayload} from './payloads/value-rich-payload';
import {TransferRichTxPayload} from './payloads/transfer-rich-payload';
import {ChainTokenByNetwork} from '../const/common.const';
import {AddLiquidityPayload} from '../transaction-parsed/payloads/add-liquidity-payload';
import {AddLiquidityRichPayload} from './payloads/add-liquidity-rich-payload';
import {
    SwapExactInputPayload,
    SwapExactOutputPayload,
} from '../transaction-parsed/payloads/swap-payload';
import {ApproveTxPayload} from '../transaction-parsed/payloads/approve-payload';
import {LimitOrderFillPayload} from '../transaction-parsed/payloads/limit-order-fill-payload';
import {TransferTxPayload} from '../transaction-parsed/payloads/transfer-payload';
import {ValueTxPayload} from '../transaction-parsed/payloads/value-payload';

export class NormalizationService {
    constructor(private customTokenSvc: CustomTokensService) {}

    async normalize(tx: TransactionParsed): Promise<TransactionRich> {
        switch (tx.tag) {
            case TransactionType.Approve:
                return {
                    ...tx,
                    payload: await this.normalizeApprove(tx.payload),
                };
            case TransactionType.Unwrap:
            case TransactionType.Wrap: {
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
            const t = await this.getToken(p.tokenAddress);
            const token = t ? t : createUnknownToken(p.tokenAddress);
            return {...p, token};
        }
    }

    private async normalizeSwapExactInput(
        p: SwapExactInputPayload
    ): Promise<SwapExactInputRichPayload> {
        const [srcToken, dstToken] = await Promise.all([
            this.getToken(p.srcTokenAddress),
            this.getToken(p.dstTokenAddress),
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
    ): Promise<SwapExactOutputRichPayload> {
        const [srcToken, dstToken] = await Promise.all([
            this.getToken(p.srcTokenAddress),
            this.getToken(p.dstTokenAddress),
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
    ): Promise<LimitOrderFillRichPayload> {
        const [srcToken, dstToken] = await Promise.all([
            this.getToken(p.srcTokenAddress),
            this.getToken(p.dstTokenAddress),
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

    private async getToken(
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
        const token = await this.getToken(p.tokenAddress);

        return {
            ...p,
            token: token ? token : createUnknownToken(p.tokenAddress),
        };
    }

    private async normalizeTransfer(
        p: TransferTxPayload
    ): Promise<TransferRichTxPayload> {
        const token = await this.getToken(p.tokenAddress);

        return {
            ...p,
            token: token ? token : createUnknownToken(p.tokenAddress),
        };
    }

    private async normalizeAddLiquidity(
        p: AddLiquidityPayload
    ): Promise<AddLiquidityRichPayload> {
        const tokens: (Token | null)[] = await Promise.all(
            p.tokenAmount.map((t) => this.getToken(t.token))
        );
        const notNullTokens: Token[] = tokens.map((t, i) =>
            t ? t : createUnknownToken(p.tokenAmount[i].token)
        );
        const zipped = p.tokenAmount.map((t, i) => ({
            ...t,
            token: notNullTokens[i],
        }));

        return {
            ...p,
            tokenAmount: zipped,
        };
    }
}
