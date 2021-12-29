import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxConfirmationComponent } from './tx-confirmation.component';

describe('TxConfirmationComponent', () => {
    let component: TxConfirmationComponent;
    let fixture: ComponentFixture<TxConfirmationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TxConfirmationComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TxConfirmationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
