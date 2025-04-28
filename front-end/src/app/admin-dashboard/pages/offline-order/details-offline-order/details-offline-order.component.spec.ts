import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOfflineOrderComponent } from './details-offline-order.component';

describe('DetailsOfflineOrderComponent', () => {
  let component: DetailsOfflineOrderComponent;
  let fixture: ComponentFixture<DetailsOfflineOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsOfflineOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsOfflineOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
