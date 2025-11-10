import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentScheduler } from './appointment-scheduler';

describe('AppointmentScheduler', () => {
  let component: AppointmentScheduler;
  let fixture: ComponentFixture<AppointmentScheduler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentScheduler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentScheduler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
