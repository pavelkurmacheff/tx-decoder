import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonInModalComponent } from './json-in-modal.component';

describe('JsonInModalComponent', () => {
    let component: JsonInModalComponent;
    let fixture: ComponentFixture<JsonInModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JsonInModalComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(JsonInModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
