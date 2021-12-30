import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MinedTxComponent } from './mined-tx.component';

const routes: Routes = [
    {
        path: '',
        component: MinedTxComponent,
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
export class MinedTxRoutingModule { }
