import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSearch } from './booking-search';

describe('BookingSearch', () => {
  let component: BookingSearch;
  let fixture: ComponentFixture<BookingSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
