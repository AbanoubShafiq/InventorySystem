import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistReqComponent } from './dist-req.component';

describe('DistReqComponent', () => {
  let component: DistReqComponent;
  let fixture: ComponentFixture<DistReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistReqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
