import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { formatUnits } from 'ethers/lib/utils';

import { ItemAmountValue } from '../../../../../../../src';

@Component({
    selector: 'app-token',
    templateUrl: './token.component.html',
    styleUrls: ['./token.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenComponent {
    @Input() item!: ItemAmountValue;

    get amount(): string {
        const amount = this.item.value.value;

        return (+formatUnits(amount, this.item.value.token.decimals)).toFixed(6);
    }
}
