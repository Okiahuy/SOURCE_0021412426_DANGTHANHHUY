import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdetailAdminComponent } from './orderdetail-admin.component';

describe('OrderdetailAdminComponent', () => {
  let component: OrderdetailAdminComponent;
  let fixture: ComponentFixture<OrderdetailAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderdetailAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderdetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
