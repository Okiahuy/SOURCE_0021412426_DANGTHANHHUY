import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandUserComponent } from './brand-user.component';

describe('BrandUserComponent', () => {
  let component: BrandUserComponent;
  let fixture: ComponentFixture<BrandUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
