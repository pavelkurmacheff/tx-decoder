import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TxConfirmationComponent } from './tx-confirmation.component';

const routes: Routes = [
    {
        path: '',
        component: TxConfirmationComponent,
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
export class TxConfirmationRoutingModule { }
