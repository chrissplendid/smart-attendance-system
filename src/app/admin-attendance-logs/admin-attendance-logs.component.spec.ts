import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAttendanceLogsComponent } from './admin-attendance-logs.component';

describe('AdminAttendanceLogsComponent', () => {
  let component: AdminAttendanceLogsComponent;
  let fixture: ComponentFixture<AdminAttendanceLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAttendanceLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAttendanceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
