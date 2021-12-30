import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HasTxInStateGuard } from './guards/has-tx-in-state.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'decoder',
        pathMatch: 'full',
    },
    {
        path: 'decoder',
        loadChildren: () => import('./decoder-box/decoder-box.module').then(m => m.DecoderBoxModule),
    },
    {
        path: 'decoded-tx',
        loadChildren: () => import('./decoded-tx-box/decoded-tx-box.module').then(m => m.DecodedTxBoxModule),
        canActivate: [HasTxInStateGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
