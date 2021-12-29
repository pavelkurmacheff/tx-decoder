import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiTooltipModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';

import { TxFieldsComponent } from './tx-fields.component';



@NgModule({
    declarations: [TxFieldsComponent],
    imports: [CommonModule, TuiInputModule, TuiTooltipModule, ReactiveFormsModule],
    exports: [TxFieldsComponent],
})
export class TxFieldsModule { }
