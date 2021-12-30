import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxFieldsComponent } from './tx-fields.component';

describe('TxFieldsComponent', () => {
    let component: TxFieldsComponent;
    let fixture: ComponentFixture<TxFieldsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TxFieldsComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TxFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
