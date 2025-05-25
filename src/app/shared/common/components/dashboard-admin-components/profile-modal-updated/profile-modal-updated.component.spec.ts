import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileModalUpdatedComponent } from './profile-modal-updated.component';

describe('ProfileModalUpdatedComponent', () => {
  let component: ProfileModalUpdatedComponent;
  let fixture: ComponentFixture<ProfileModalUpdatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileModalUpdatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileModalUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
