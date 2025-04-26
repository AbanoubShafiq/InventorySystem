import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchProductsComponent } from './branch-products.component';

describe('BranchProductsComponent', () => {
  let component: BranchProductsComponent;
  let fixture: ComponentFixture<BranchProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
