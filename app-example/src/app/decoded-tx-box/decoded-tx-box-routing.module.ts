import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DecodedTxBoxComponent } from './decoded-tx-box.component';

const routes: Routes = [
    {
        path: '',
        component: DecodedTxBoxComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class DecodedTxBoxRoutingModule { }
