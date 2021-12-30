import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder, NG_VALIDATORS,
    NG_VALUE_ACCESSOR, ValidationErrors,
    Validator,
    Validators,
} from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs';
import { isHex } from '../../../validators';


@Component({
    selector: 'app-tx-fields',
    templateUrl: './tx-fields.component.html',
    styleUrls: ['./tx-fields.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TxFieldsComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: TxFieldsComponent,
            multi: true,
        },
        TuiDestroyService,
    ],
})
export class TxFieldsComponent implements OnInit, ControlValueAccessor, Validator {
    readonly form = this.fb.group({
        from: ['', [Validators.required, isHex]],
        to: ['', [Validators.required, isHex]],
        value: ['', [Validators.required, isHex]],
        data: ['', [Validators.required, isHex]],
    });

    constructor(
      private readonly fb: FormBuilder,
      private readonly onDestroy$: TuiDestroyService
    ) { }

    // eslint-disable-next-line
    onChange(_: any): void {}
    // eslint-disable-next-line
    onTouched(): void {}

    ngOnInit(): void {
        this.form.valueChanges.pipe(
            takeUntil(this.onDestroy$),
        ).subscribe({
            next: value => this.onChange(value),
        });
    }

    writeValue(value: any) {
        value = value ?? {};
        this.form.reset(value, { emitEvent: false, onlySelf: true });
    }

    registerOnChange(fn: (_: any) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.form.valid ? null : { txConfigInvalid: true };
    }
}
