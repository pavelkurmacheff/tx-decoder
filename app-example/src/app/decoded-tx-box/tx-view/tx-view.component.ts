import { Component, Input, OnInit } from '@angular/core';

import { TxItems } from '../../decoder.service';

@Component({
    selector: 'app-tx-view',
    templateUrl: './tx-view.component.html',
    styleUrls: ['./tx-view.component.scss'],
})
export class TxViewComponent {
    @Input() txItems: TxItems | undefined;
}
