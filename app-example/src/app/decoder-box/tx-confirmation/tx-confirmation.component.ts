import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { asyncScheduler, BehaviorSubject, finalize, observeOn, startWith, takeUntil } from 'rxjs';

import { Transaction } from '../../../../../src';
import { DecoderService } from '../../decoder.service';

@Component({
    selector: 'app-tx-confirmation',
    templateUrl: './tx-confirmation.component.html',
    styleUrls: ['./tx-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TuiDestroyService],
})
export class TxConfirmationComponent implements OnInit {
    readonly form = this.fb.group({
        txConfig: [],
        pasteJson: [false],
        json: [],
    });

    readonly isLoading$ = new BehaviorSubject(false);

    readonly pasteJson = this.form.get('pasteJson')?.valueChanges.pipe(
        startWith(false),
    );

    constructor(
        private readonly fb: FormBuilder,
        private readonly decoder: DecoderService,
        private readonly onDestroy$: TuiDestroyService,
        private readonly router: Router,
    ) {
    }

    ngOnInit(): void {
        this.pasteJson?.pipe(
            observeOn(asyncScheduler),
        ).subscribe({
            next: () => {
                this.form.get('txConfig')?.updateValueAndValidity();
            },
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            return;
        }

        const formValue = this.form.value as { txConfig: Transaction, pasteJson: boolean, json: Transaction };
        const txConfig: Transaction = formValue.pasteJson ? formValue.json : formValue.txConfig;

        this.isLoading$.next(true);

        this.decoder.decode(txConfig).pipe(
            finalize(() => this.isLoading$.next(false)),
            takeUntil(this.onDestroy$),
        ).subscribe({
            next: (txData) => {
                this.router.navigate(['decoded-tx'], { state: { txData } });
            },
        });
    }
}
