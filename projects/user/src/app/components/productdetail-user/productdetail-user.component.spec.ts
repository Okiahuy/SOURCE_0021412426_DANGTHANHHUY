import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductdetailUserComponent } from './productdetail-user.component';

describe('ProductdetailUserComponent', () => {
  let component: ProductdetailUserComponent;
  let fixture: ComponentFixture<ProductdetailUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductdetailUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductdetailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
