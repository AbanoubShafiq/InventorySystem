import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCashierComponent } from './edit-cashier.component';

describe('EditCashierComponent', () => {
  let component: EditCashierComponent;
  let fixture: ComponentFixture<EditCashierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCashierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
