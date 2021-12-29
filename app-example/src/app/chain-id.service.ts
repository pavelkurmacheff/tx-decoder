import { Injectable } from '@angular/core';
import { defer, map } from 'rxjs';

const explorerLink = new Map<number, string>([
    [1, 'https://etherscan.io/tx/'],
    [56, 'https://bscscan.com/tx/'],
    [137, 'https://polygonscan.com/tx/'],
    [10, 'https://polygonscan.com/tx/'],
    [42161, 'https://arbiscan.io/tx/'],
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
