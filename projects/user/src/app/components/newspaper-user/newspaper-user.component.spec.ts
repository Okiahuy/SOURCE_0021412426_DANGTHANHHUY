import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewspaperUserComponent } from './newspaper-user.component';

describe('NewspaperUserComponent', () => {
  let component: NewspaperUserComponent;
  let fixture: ComponentFixture<NewspaperUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewspaperUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewspaperUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
