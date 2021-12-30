import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DecoderBoxComponent } from './decoder-box.component';

const routes: Routes = [
    {
        path: '',
        component: DecoderBoxComponent,
        children: [
            {
                path: '',
                redirectTo: 'mined-tx',
                pathMatch: 'full',
            },
            {
                path: 'mined-tx',
                loadChildren: () => import('./mined-tx/mined-tx.module').then(m => m.MinedTxModule),
            },
            {
                path: 'tx-confirmation',
                loadChildren: () =>
                    import('./tx-confirmation/tx-confirmation.module').then(m => m.TxConfirmationModule),
            },
        ],
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
export class DecoderRoutingModule { }
