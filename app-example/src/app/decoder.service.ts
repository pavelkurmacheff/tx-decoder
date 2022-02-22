import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

import {
    Item,
    CommonTxDecoder,
    OinchTxDecodingResult,
    Transaction,
    TxConfirmDataBuilder,
    TxType,
} from '../../../src/';
import { TokenApiService, TokenMap, TokenPrices } from './api/token-api.service';
import { ChainIdService } from './chain-id.service';

export interface TxItems {
    items: Item[];
    txType: TxType;
    dataArguments: any;
}

export interface DecoderResult {
    decodedResult: Pick<OinchTxDecodingResult, 'data' | 'dataArguments'>,
    uiBuildResult: TxItems,
}

@Injectable({
    providedIn: 'root',
})
export class DecoderService {
    private readonly rpcCaller = {
        call(method: string, params: any[]): Promise<any> {
            return (window as any).ethereum.request({ method, params });
        },
    };

    constructor(
      private readonly tokenApi: TokenApiService,
      private readonly chainIdService: ChainIdService,
    ) {
    }

    decode(tx: Transaction | string): Observable<DecoderResult> {
        return this.getTokens().pipe(
            map(([tokens, tokenPrices]) => {
                const builder = new TxConfirmDataBuilder({
                    tokens,
                    tokenPrices,
                }, this.rpcCaller);

                const decoder = new CommonTxDecoder({
                    tokens,
                    tokenPrices,
                }, this.rpcCaller);

                return {
                    builder,
                    decoder,
                };
            }),
            switchMap(async ({ builder, decoder }) => {
                const decoded = typeof tx === 'string' ?
                    await decoder.decodeTxByLogs(tx) :
                    await decoder.decodeTxByEstimation(tx);
                const decodedResult = {
                    data: decoded.data,
                    dataArguments: decoded.dataArguments,
                };

                const uiBuildResult = await builder.buildItemsForTx(tx);

                return {
                    decodedResult,
                    uiBuildResult,
                };
            }),
        );
    }

    private getTokens(): Observable<[TokenMap, TokenPrices]> {
        return this.chainIdService.chainId$.pipe(
            switchMap(chainId => forkJoin([
                this.tokenApi.getAllTokens(chainId),
                this.tokenApi.getTokenPricesInETH(chainId),
            ]))
        );
    }
}
