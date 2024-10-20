import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAdminComponent } from './error-admin.component';

describe('ErrorAdminComponent', () => {
  let component: ErrorAdminComponent;
  let fixture: ComponentFixture<ErrorAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
