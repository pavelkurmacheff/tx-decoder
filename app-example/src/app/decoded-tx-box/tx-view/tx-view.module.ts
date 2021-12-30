import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiLetModule } from '@taiga-ui/cdk';

import { TxViewComponent } from './tx-view.component';
import { TextItemComponent } from './tx-view-items/text-item/text-item.component';
import { TokenComponent } from './tx-view-items/token/token.component';
import {RouterModule} from "@angular/router";
import { TokenLinkPipe } from '../../pipes/token-link.pipe';
import { AddressLinkPipe } from '../../pipes/address-link.pipe';



@NgModule({
    declarations: [TxViewComponent, TokenComponent, TextItemComponent, TokenLinkPipe, AddressLinkPipe],
    imports: [CommonModule, TuiLetModule, RouterModule],
    exports: [TxViewComponent],
})
export class TxViewModule { }
