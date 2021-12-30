import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { JsonEditorOptions } from 'ang-jsoneditor';

@Component({
    selector: 'app-json-in-modal',
    templateUrl: './json-in-modal.component.html',
    styleUrls: ['./json-in-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonInModalComponent {
    readonly form = this.fb.group({
        json: [],
    });

    readonly jsonEditorOptions = new JsonEditorOptions();

    constructor(
      private readonly dialogService: TuiDialogService,
      @Inject(POLYMORPHEUS_CONTEXT)
      private readonly context: TuiDialogContext<object | void, object>,
      private readonly fb: FormBuilder,
    ) {
        this.jsonEditorOptions.mode = 'code';
        this.jsonEditorOptions.statusBar = false;

        if (this.context.data) {
            this.form.setValue({ json: this.context.data }, { emitEvent: false });
        }
    }

    close(): void {
        this.context.completeWith();
    }

    save(): void {
        if (this.form.invalid) {
            return;
        }

        this.context.completeWith(this.form.get('json')?.value as object);
    }
}
