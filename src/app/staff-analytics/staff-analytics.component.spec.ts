import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAnalyticsComponent } from './staff-analytics.component';

describe('StaffAnalyticsComponent', () => {
  let component: StaffAnalyticsComponent;
  let fixture: ComponentFixture<StaffAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
