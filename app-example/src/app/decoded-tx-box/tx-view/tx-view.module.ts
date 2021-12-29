import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiLetModule } from '@taiga-ui/cdk';

import { TxViewComponent } from './tx-view.component';
import { TextItemComponent } from './tx-view-items/text-item/text-item.component';
import { TokenComponent } from './tx-view-items/token/token.component';



@NgModule({
    declarations: [TxViewComponent, TokenComponent, TextItemComponent],
    imports: [CommonModule, TuiLetModule],
    exports: [TxViewComponent],
})
export class TxViewModule { }
