
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './booking-search.html',
  styleUrls: ['./booking-search.css'],
})
export class BookingSearch {
  q = '';

  @Output() doctorSelected = new EventEmitter<string>();

  search() {
    this.doctorSelected.emit(this.q); // Pass query to parent
  }
}
