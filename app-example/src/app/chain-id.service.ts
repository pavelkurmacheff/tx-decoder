import { Injectable } from '@angular/core';
import { defer, map } from 'rxjs';

const explorerLink = new Map<number, string>([
    [1, 'https://etherscan.io'],
    [56, 'https://bscscan.com'],
    [137, 'https://polygonscan.com'],
    [10, 'https://polygonscan.com'],
    [42161, 'https://arbiscan.io'],
]);

@Injectable({
    providedIn: 'root',
})
export class ChainIdService {
    readonly chainId$ = defer(() => (window as any).ethereum.request({ method: 'eth_chainId' })).pipe(
        map(val => +(val as string)),
    );

    readonly explorerLink$ = this.chainId$.pipe(
        map(chainId => explorerLink.get(chainId) ?? '#'),
    );
}
