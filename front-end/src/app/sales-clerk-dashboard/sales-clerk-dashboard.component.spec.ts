import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesClerkDashboardComponent } from './sales-clerk-dashboard.component';

describe('SalesClerkDashboardComponent', () => {
  let component: SalesClerkDashboardComponent;
  let fixture: ComponentFixture<SalesClerkDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesClerkDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesClerkDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
