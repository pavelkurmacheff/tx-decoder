import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoderBoxComponent } from './decoder-box.component';

describe('DecoderFormComponent', () => {
    let component: DecoderBoxComponent;
    let fixture: ComponentFixture<DecoderBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DecoderBoxComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DecoderBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
