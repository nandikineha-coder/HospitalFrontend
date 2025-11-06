
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css'],
})
export class PatientDashboard implements OnInit {
  patientName: string = '';
  selectedOption: string = 'home'; // default view

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.loadPatientName();
  }

  loadPatientName(): void {
  const id = Number(localStorage.getItem('userId')); // assuming you store userId after login

  if (id) {
    this.api.getPatientProfile(id).subscribe({
      next: (data: any) => {
        this.patientName = `Patient #${data.paitentId}`; // or use other fields if available
        // You can also store other profile data here
      },
      error: (err) => {
        console.error('Failed to load patient profile', err);
      }
    });
  }
}


  selectOption(option: string): void {
    this.selectedOption = option;
  }

  logout(): void {
    localStorage.clear(); // or remove specific tokens
    // Redirect to login page
    window.location.href = '/login';
  }
}
