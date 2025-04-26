import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesClerkComponent } from './edit-sales-clerk.component';

describe('EditSalesClerkComponent', () => {
  let component: EditSalesClerkComponent;
  let fixture: ComponentFixture<EditSalesClerkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSalesClerkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSalesClerkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
