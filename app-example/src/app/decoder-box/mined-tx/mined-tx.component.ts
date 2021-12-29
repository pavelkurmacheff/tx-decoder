import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BehaviorSubject, finalize, takeUntil } from 'rxjs';

import { DecoderService } from '../../decoder.service';
import { isHex } from '../../validators';

@Component({
    selector: 'app-mined-tx',
    templateUrl: './mined-tx.component.html',
    styleUrls: ['./mined-tx.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TuiDestroyService],
})
export class MinedTxComponent {
    readonly form = this.fb.group({
        txHash: ['', [Validators.required, isHex]],
    });

    readonly isLoading$ = new BehaviorSubject(false);

    constructor(
        private readonly fb: FormBuilder,
        private readonly decoder: DecoderService,
        private readonly onDestroy$: TuiDestroyService,
        private readonly router: Router,
    ) { }

    onSubmit() {
        if (this.form.invalid) {
            return;
        }

        this.isLoading$.next(true);
        this.decoder.decode(this.form.value.txHash as string).pipe(
            finalize(() => this.isLoading$.next(false)),
            takeUntil(this.onDestroy$),
        ).subscribe({
            next: (txData) => {
                this.router.navigate(['decoded-tx'], { state: { txData } });
            },
        });
    }
}
