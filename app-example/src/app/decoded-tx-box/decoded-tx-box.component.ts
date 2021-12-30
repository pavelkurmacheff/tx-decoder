import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { DecoderResult } from '../decoder.service';

@Component({
    selector: 'app-decoded-tx-box',
    templateUrl: './decoded-tx-box.component.html',
    styleUrls: ['./decoded-tx-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecodedTxBoxComponent {
    activeItemIndex = 0;

    readonly parsedTx: DecoderResult | undefined;

    constructor(
        private readonly router: Router,
    ) {
        const routerState = this.router.getCurrentNavigation()?.extras?.state;
        this.parsedTx = routerState ? routerState['txData'] as DecoderResult : undefined;
    }
}
