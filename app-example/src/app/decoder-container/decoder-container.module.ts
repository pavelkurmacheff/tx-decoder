import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DecoderContainerComponent } from './decoder-container.component';



@NgModule({
    declarations: [DecoderContainerComponent],
    exports: [DecoderContainerComponent],
    imports: [CommonModule],
})
export class DecoderContainerModule { }
