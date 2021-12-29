import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Token } from '../../../../src';
import { environment } from '../../environments/environment';

export type TokenMap = Record<string, Token>;
export type TokenPrices = Record<string, string>;

@Injectable({
    providedIn: 'root',
})
export class TokenApiService {
    constructor(private readonly http: HttpClient) { }

    public getAllTokens(chainId: number): Observable<TokenMap> {
        return this.http.get<TokenMap>(`${environment.tokenListApiUrl}/${chainId}`);
    }

    public getTokenPricesInETH(chainId: number): Observable<TokenPrices> {
        return this.http.get<TokenPrices>(`${environment.tokenPriceApiUrl}/${chainId}`);
    }
}
