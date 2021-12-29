import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuiDialogModule, TuiNotificationsModule, TuiRootModule } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DecoderBoxModule } from './decoder-box/decoder-box.module';
import { DecoderContainerModule } from './decoder-container/decoder-container.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        TuiRootModule,
        BrowserAnimationsModule,
        TuiDialogModule,
        TuiNotificationsModule,
        DecoderContainerModule,
        DecoderBoxModule,
        HttpClientModule,
        NgJsonEditorModule,
    ],
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: {
                required: 'This field is required',
                isNotHex: 'Value is not hex',
            },
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
