import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiSvgModule, TuiTooltipModule } from '@taiga-ui/core';
import { TuiInputModule, TuiToggleModule } from '@taiga-ui/kit';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { JsonEditorModule } from '../../json-editor/json-editor.module';
import { TxConfirmationComponent } from './tx-confirmation.component';
import { TxConfirmationRoutingModule } from './tx-confirmation-routing.module';
import { TxFieldsModule } from './tx-fields/tx-fields.module';



@NgModule({
    declarations: [TxConfirmationComponent],
    imports: [
        CommonModule,
        TxConfirmationRoutingModule,
        TuiInputModule,
        ReactiveFormsModule,
        TuiButtonModule,
        TuiTooltipModule,
        TuiToggleModule,
        NgJsonEditorModule,
        TuiLetModule,
        TxFieldsModule,
        JsonEditorModule,
        TuiSvgModule,
    ],
})
export class TxConfirmationModule { }
