
import { Component, OnInit } from '@angular/core';
import { Api } from '../../../services/api';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-booking-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-results.html',
  styleUrl: './booking-results.css',
})
export class BookingResults implements OnInit {


  q = '';
  doctors: any[] = [];
  loading = true;
  error = '';

  constructor(private api: Api, private ar: ActivatedRoute) { }

  ngOnInit() {
    this.loading = false;
    this.q = this.ar.snapshot.queryParamMap.get('q') || '';
    const id = localStorage.getItem('userId');
    const searchParam = encodeURIComponent(this.q);
    // Backend suggestion: GET /api/users?role=Doctor returns doctor users
    this.api.get(`/PatientProfile/${id}/getalldoctors`).subscribe({
      next: (res: any) => {
        this.doctors = res;
      },
      error: (err) => {
        console.error('Failed to load doctors', err);
      }
    });
  }

}


