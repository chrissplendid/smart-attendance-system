import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManualAttendanceComponent } from './admin-manual-attendance.component';

describe('AdminManualAttendanceComponent', () => {
  let component: AdminManualAttendanceComponent;
  let fixture: ComponentFixture<AdminManualAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManualAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManualAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
