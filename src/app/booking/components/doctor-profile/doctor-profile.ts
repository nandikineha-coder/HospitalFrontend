
import { Component, OnInit } from '@angular/core';
import { Api } from '../../../services/api';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile implements OnInit {


  doc: any; error = '';

  constructor(private api: Api, private ar: ActivatedRoute) { }

  ngOnInit() {
    const id = Number(this.ar.snapshot.paramMap.get('userId'));
    // Load doctor details
    this.api.get(`/PatientProfile/getdoc/${id}`).subscribe({
      next: (p: any) => {
        this.doc = { doctorId: p.userId, specialization: p.dd.specialization, qualifications: p.dd.qualifications, experience: p.dd.experience, name: 'Doctor ' + p.firstName, email: p.email, rating: p.dd.rating, description: p.dd.description };
        // Optional: enrich with user info /api/users?role=Doctor and filter by id
      },
      error: () => this.error = 'Failed to load doctor profile'
    });
  }


}
