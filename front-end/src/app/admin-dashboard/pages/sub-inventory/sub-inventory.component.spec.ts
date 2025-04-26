import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubInventoryComponent } from './sub-inventory.component';

describe('SubInventoryComponent', () => {
  let component: SubInventoryComponent;
  let fixture: ComponentFixture<SubInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
