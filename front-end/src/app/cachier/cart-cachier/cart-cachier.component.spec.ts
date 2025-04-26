import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCachierComponent } from './cart-cachier.component';

describe('CartCachierComponent', () => {
  let component: CartCachierComponent;
  let fixture: ComponentFixture<CartCachierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCachierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartCachierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
