import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiTabsModule } from '@taiga-ui/kit';

import { DecoderBoxComponent } from './decoder-box.component';
import { DecoderRoutingModule } from './decoder-routing.module';


@NgModule({
    declarations: [DecoderBoxComponent],
    exports: [DecoderBoxComponent],
    imports: [
        CommonModule,
        RouterModule,
        TuiTabsModule,
        DecoderRoutingModule,
    ],
})
export class DecoderBoxModule { }
