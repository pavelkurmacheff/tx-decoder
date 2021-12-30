import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-decoder-container',
    templateUrl: './decoder-container.component.html',
    styleUrls: ['./decoder-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecoderContainerComponent {
}
