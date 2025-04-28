import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineOrderComponent } from './offline-order.component';

describe('OfflineOrderComponent', () => {
  let component: OfflineOrderComponent;
  let fixture: ComponentFixture<OfflineOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
