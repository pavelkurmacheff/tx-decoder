import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecodedTxBoxComponent } from './decoded-tx-box.component';

describe('DecodedTxBoxComponent', () => {
    let component: DecodedTxBoxComponent;
    let fixture: ComponentFixture<DecodedTxBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DecodedTxBoxComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DecodedTxBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
