

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-booking-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './booking-search.html',
  styleUrl: './booking-search.css',
})
export class BookingSearch {

  q = '';
  constructor(private router: Router) { }
  search() { this.router.navigate(['/result'], { queryParams: { q: this.q } }); }

}
