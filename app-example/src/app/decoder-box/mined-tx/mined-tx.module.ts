import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule, TuiTooltipModule } from '@taiga-ui/core';
import { TuiFieldErrorModule, TuiInputModule, TuiTabsModule } from '@taiga-ui/kit';

import { MinedTxComponent } from './mined-tx.component';
import { MinedTxRoutingModule } from './mined-tx-routing.module';

@NgModule({
    declarations: [MinedTxComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MinedTxRoutingModule,
        TuiTabsModule,
        TuiInputModule,
        TuiTextfieldControllerModule,
        TuiSvgModule,
        TuiButtonModule,
        TuiTooltipModule,
        TuiLetModule,
        TuiFieldErrorModule,
    ],
    exports: [MinedTxComponent],
})
export class MinedTxModule { }
