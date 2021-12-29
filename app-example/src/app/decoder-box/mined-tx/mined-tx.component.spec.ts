import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinedTxComponent } from './mined-tx.component';

describe('MinedTxComponent', () => {
    let component: MinedTxComponent;
    let fixture: ComponentFixture<MinedTxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MinedTxComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MinedTxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
