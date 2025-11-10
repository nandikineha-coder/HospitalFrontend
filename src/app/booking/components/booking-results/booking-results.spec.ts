import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingResults } from './booking-results';

describe('BookingResults', () => {
  let component: BookingResults;
  let fixture: ComponentFixture<BookingResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
