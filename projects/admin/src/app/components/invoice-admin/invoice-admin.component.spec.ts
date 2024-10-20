import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAdminComponent } from './invoice-admin.component';

describe('InvoiceAdminComponent', () => {
  let component: InvoiceAdminComponent;
  let fixture: ComponentFixture<InvoiceAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
