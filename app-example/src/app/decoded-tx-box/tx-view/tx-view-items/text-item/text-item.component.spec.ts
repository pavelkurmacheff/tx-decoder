import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextItemComponent } from './text-item.component';

describe('WalletComponent', () => {
    let component: TextItemComponent;
    let fixture: ComponentFixture<TextItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TextItemComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TextItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
