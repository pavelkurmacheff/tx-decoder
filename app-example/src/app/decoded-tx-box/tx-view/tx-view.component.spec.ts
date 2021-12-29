import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxViewComponent } from './tx-view.component';

describe('TxViewComponent', () => {
    let component: TxViewComponent;
    let fixture: ComponentFixture<TxViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TxViewComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TxViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
