import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnrollBiometricComponent } from './admin-enroll-biometric.component';

describe('AdminEnrollBiometricComponent', () => {
  let component: AdminEnrollBiometricComponent;
  let fixture: ComponentFixture<AdminEnrollBiometricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEnrollBiometricComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEnrollBiometricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
