import {
    MulticallItem,
    MulticallPayload,
    TransactionParsed,
} from '../../core/transaction-parsed';
import {
    MulticallPayloadRich,
    MulticallRichItem,
    TransactionRich,
} from '../../core/transaction-rich';
import {createUnknownToken, Token} from '../../core/token';
import {TransactionType} from '../../core/transaction-type';
import {CustomTokensService} from '../../helpers/tokens/custom-tokens.service';
import {ChainTokenByNetwork} from '../../const/common.const';
import {LimitOrderFillPayload} from '../../core/transaction-parsed/limit-order-fill-payload';
import {ApproveTxPayload} from '../../core/transaction-parsed/approve-payload';
import {ApproveRich} from '../../core/transaction-rich/approve-rich-payload';
import {
    SwapExactInputRich,
    SwapExactOutputRich,
} from '../../core/transaction-rich/swap-payload';
import {LimitOrderFillRich} from '../../core/transaction-rich/limit-order-fill';
import {
    SwapExactInputPayload,
    SwapExactOutputPayload,
    SwapThroughPoolPayload,
} from '../../core/transaction-parsed/swap-payload';
import PoolService from '../../helpers/pools/pool.service';

export class NormalizationService {
    constructor(
        private customTokenSvc: CustomTokensService,
        private poolSvc: PoolService
    ) {}

    async normalize(tx: TransactionParsed): Promise<TransactionRich> {
        switch (tx.tag) {
            case TransactionType.Approve:
                return {
                    ...tx,
                    payload: await this.normalizeApprove(tx.payload),
                };
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
            case TransactionType.SwapThroughPool:
                return {
                    ...tx,
                    payload: await this.normilizeSwapThroughPool(tx.payload),
                };
        }
    }

    private async normalizeApprove(
        p?: ApproveTxPayload
    ): Promise<ApproveRich | undefined> {
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
        const mapNonError: (i: MulticallItem) => Promise<MulticallRichItem> =
            async (i) => {
                switch (i.tag) {
                    case TransactionType.Approve:
                        return {
                            ...i,
                            payload: await this.normalizeApprove(i.payload),
                        };
                    case TransactionType.Unwrap:
                        return i;
                    case TransactionType.SwapExactInput:
                        return {
                            ...i,
                            payload: await this.normalizeSwapExactInput(
                                i.payload
                            ),
                        };
                    case TransactionType.SwapExactOutput:
                        return {
                            ...i,
                            payload: await this.normalizeSwapExactOutput(
                                i.payload
                            ),
                        };
                    case TransactionType.LimitOrderFill:
                        return {
                            ...i,
                            payload: await this.normalizeLimitOrderFill(
                                i.payload
                            ),
                        };
                    case TransactionType.LimitOrderCancel:
                        return i;
                    case TransactionType.Multicall:
                        return {
                            ...i,
                            payload: await this.normalizeMulticall(i.payload),
                        };
                }
            };

        const ps = p.map(async (i) => {
            switch (i.tag) {
                case 'Error':
                    return i;
                default:
                    return mapNonError(i);
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

    private async normilizeSwapThroughPool(p: SwapThroughPoolPayload) {
        let srcTokenAddress = '';
        let dstTokenAddress = '';

        if (p.srcTokenAddress) {
            srcTokenAddress = p.srcTokenAddress;
            dstTokenAddress = await this.poolSvc.getDestTokenAddress(
                p.poolAddressess[p.poolAddressess.length - 1]
            );
        } else {
            const tokenAddressList = await this.poolSvc.getBothTokenAddress(
                p.poolAddressess
            );
            srcTokenAddress = tokenAddressList[0];
            dstTokenAddress = tokenAddressList[1];
        }

        const [srcToken, dstToken] = await Promise.all([
            this.getToket(srcTokenAddress),
            this.getToket(dstTokenAddress),
        ]);

        return {
            ...p,
            srcToken: srcToken ? srcToken : createUnknownToken(srcTokenAddress),
            dstToken: dstToken ? dstToken : createUnknownToken(dstTokenAddress),
        };
    }
}
