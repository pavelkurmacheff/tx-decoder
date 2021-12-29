import { ChangeDetectionStrategy, Component, forwardRef, Injector, Input } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator,
} from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { filter, take, takeUntil } from 'rxjs';

import { JsonInModalComponent } from './json-in-modal/json-in-modal.component';

@Component({
    selector: 'app-json-editor',
    templateUrl: './json-editor.component.html',
    styleUrls: ['./json-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => JsonEditorComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: JsonEditorComponent,
            multi: true,
        },
        TuiDestroyService,
    ],
})
export class JsonEditorComponent implements ControlValueAccessor, Validator {
    readonly control = new FormControl({});

    readonly jsonEditorOptions = new JsonEditorOptions();

    constructor(
        private readonly dialogService: TuiDialogService,
        private readonly injector: Injector,
        private readonly onDestroy$: TuiDestroyService,
    ) {
        this.jsonEditorOptions.mode = 'code';
        this.jsonEditorOptions.statusBar = false;
    }

    @Input() set value(val: object | null | undefined) {
        val = val ?? {};
        this.control.setValue(val);
    }

    @Input() set disabled(val: boolean) {
        this.setDisabledState(val);
    }

    // eslint-disable-next-line
    onChanged(val: any): void {}
    // eslint-disable-next-line
    onTouched(): void {}

    ngOnInit(): void {
        this.control.valueChanges.pipe(
            takeUntil(this.onDestroy$),
        ).subscribe({
            next: value => this.onChanged(value),
        });
    }

    registerOnChange(fn: (val: any) => void): void {
        this.onChanged = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return control.valid ? null : { jsonInvalid: true };
    }

    writeValue(val: any): void {
        this.control.setValue(val, { emitEvent: false });
    }

    setDisabledState(isDisabled: boolean): void {
        const opts = { emitEvent: false };
        isDisabled ? this.control.disable(opts) : this.control.enable(opts);
    }

    openInModal(): void {
        this.dialogService.open<object | undefined>(
            new PolymorpheusComponent(JsonInModalComponent, this.injector),
            {
                data: { ...this.control.value },
            },
        ).pipe(
            take(1),
            filter(Boolean),
            takeUntil(this.onDestroy$),
        ).subscribe({
            next: (value) => {
                this.control.setValue(value);
            },
        });
    }
}
