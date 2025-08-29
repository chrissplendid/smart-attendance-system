import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAttendanceLogsComponent } from './staff-attendance-logs.component';

describe('StaffAttendanceLogsComponent', () => {
  let component: StaffAttendanceLogsComponent;
  let fixture: ComponentFixture<StaffAttendanceLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAttendanceLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffAttendanceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
