import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserCustomComponent } from './update-user-custom.component';

describe('UpdateUserCustomComponent', () => {
  let component: UpdateUserCustomComponent;
  let fixture: ComponentFixture<UpdateUserCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUserCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
