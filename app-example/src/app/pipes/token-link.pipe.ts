import { Pipe, PipeTransform } from '@angular/core';

import { map, Observable } from 'rxjs';
import { ChainIdService } from '../chain-id.service';

@Pipe({
    name: 'tokenLink',
    pure: true,
})
export class TokenLinkPipe implements PipeTransform {
    constructor(
        private chainIdService: ChainIdService
    ) {
    }

    transform(tokenAddress: string): Observable<string> {
        return this.chainIdService.explorerLink$.pipe(
            map(link => {
                return `${link}/token/${tokenAddress}`
            })
        );
    }
}
