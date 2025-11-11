
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Api } from '../../../services/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-results.html',
  styleUrls: ['./booking-results.css'],
})
export class BookingResults implements OnInit {
  @Input() q = '';
  @Output() viewProfile = new EventEmitter<number>();
  
@Output() backToSearch = new EventEmitter<void>();

goBack() {
  this.backToSearch.emit();
}


  openProfile(doctorId: number) {
  this.viewProfile.emit(doctorId);
}


  doctors: any[] = [];
  loading = true;
  error = '';

  constructor(private api: Api) {}

  ngOnInit() {
    this.loading = false;
    const id = localStorage.getItem('userId');
    this.api.get(`/PatientProfile/${id}/getalldoctors`).subscribe({
      next: (res: any) => (this.doctors = res),
      error: (err) => console.error('Failed to load doctors', err)
    });
  }
}
