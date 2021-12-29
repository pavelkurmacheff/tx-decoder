import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoderContainerComponent } from './decoder-container.component';

describe('DecoderContainerComponent', () => {
    let component: DecoderContainerComponent;
    let fixture: ComponentFixture<DecoderContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DecoderContainerComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DecoderContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
