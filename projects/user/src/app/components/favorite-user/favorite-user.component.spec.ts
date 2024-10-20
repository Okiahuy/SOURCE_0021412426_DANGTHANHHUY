import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteUserComponent } from './favorite-user.component';

describe('FavoriteUserComponent', () => {
  let component: FavoriteUserComponent;
  let fixture: ComponentFixture<FavoriteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
