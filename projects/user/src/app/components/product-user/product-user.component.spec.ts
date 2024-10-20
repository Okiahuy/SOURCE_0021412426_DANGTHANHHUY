import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUserComponent } from './product-user.component';

describe('ProductUserComponent', () => {
  let component: ProductUserComponent;
  let fixture: ComponentFixture<ProductUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
