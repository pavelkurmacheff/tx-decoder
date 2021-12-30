import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-decoder-box',
    templateUrl: './decoder-box.component.html',
    styleUrls: ['./decoder-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecoderBoxComponent {
}
