import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiTabsModule } from '@taiga-ui/kit';

import { JsonEditorModule } from '../json-editor/json-editor.module';
import { DecodedTxBoxComponent } from './decoded-tx-box.component';
import { DecodedTxBoxRoutingModule } from './decoded-tx-box-routing.module';
import { TxViewModule } from './tx-view/tx-view.module';


@NgModule({
    declarations: [DecodedTxBoxComponent],
    imports: [
        CommonModule,
        TuiTabsModule,
        DecodedTxBoxRoutingModule,
        TuiButtonModule,
        TuiSvgModule,
        TxViewModule,
        JsonEditorModule,
    ],
    exports: [DecodedTxBoxComponent],
})
export class DecodedTxBoxModule {
}
