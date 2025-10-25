import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStudentManualAttendanceComponent } from './admin-student-manual-attendance.component';

describe('AdminStudentManualAttendanceComponent', () => {
  let component: AdminStudentManualAttendanceComponent;
  let fixture: ComponentFixture<AdminStudentManualAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStudentManualAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStudentManualAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
