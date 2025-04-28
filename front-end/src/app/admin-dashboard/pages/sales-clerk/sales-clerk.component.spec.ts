import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesClerkComponent } from './sales-clerk.component';

describe('SalesClerkComponent', () => {
  let component: SalesClerkComponent;
  let fixture: ComponentFixture<SalesClerkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesClerkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesClerkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
