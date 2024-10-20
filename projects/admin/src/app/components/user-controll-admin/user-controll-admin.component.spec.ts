import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserControllAdminComponent } from './user-controll-admin.component';

describe('UserControllAdminComponent', () => {
  let component: UserControllAdminComponent;
  let fixture: ComponentFixture<UserControllAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserControllAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserControllAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
