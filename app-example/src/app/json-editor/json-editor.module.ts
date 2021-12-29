import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { JsonEditorComponent } from './json-editor.component';
import { JsonInModalComponent } from './json-in-modal/json-in-modal.component';

@NgModule({
    declarations: [
        JsonEditorComponent,
        JsonInModalComponent,
    ],
    exports: [JsonEditorComponent],
    imports: [
        CommonModule,
        NgJsonEditorModule,
        TuiSvgModule,
        TuiButtonModule,
        ReactiveFormsModule,
    ],
})
export class JsonEditorModule { }
