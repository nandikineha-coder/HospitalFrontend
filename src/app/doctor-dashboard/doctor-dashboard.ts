import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit{
 doctorName: string = '';
  selectedOption: string = 'home';

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.loadDoctorName();
  }

  loadDoctorName(): void {
  const id = Number(localStorage.getItem('userId'));

  if (id) {
    this.api.getPatientProfile(id).subscribe({
      next: (data: any) => {
        this.doctorName = `Doctor #${data.paitentId}`;
      },
      error: (err) => {
        console.error('Failed to load doctor profile', err);
      }
    });
  }
}


  selectOption(option: string): void {
    this.selectedOption = option;
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}
