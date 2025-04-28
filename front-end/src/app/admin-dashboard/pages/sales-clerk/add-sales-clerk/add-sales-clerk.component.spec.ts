import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesClerkComponent } from './add-sales-clerk.component';

describe('AddSalesClerkComponent', () => {
  let component: AddSalesClerkComponent;
  let fixture: ComponentFixture<AddSalesClerkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSalesClerkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSalesClerkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
