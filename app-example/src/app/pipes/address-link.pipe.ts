import { Pipe, PipeTransform } from '@angular/core';

import { map, Observable } from 'rxjs';
import { ChainIdService } from '../chain-id.service';

@Pipe({
    name: 'addressLink',
    pure: true,
})
export class AddressLinkPipe implements PipeTransform {
    constructor(
        private chainIdService: ChainIdService
    ) {
    }

    transform(address: string): Observable<string> {
        return this.chainIdService.explorerLink$.pipe(
            map(link => {
                return `${link}/address/${address}`
            })
        );
    }
}
