
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Api } from '../../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-profile.html',
  styleUrls: ['./doctor-profile.css'],
})
export class DoctorProfile implements OnInit {
  @Input() doctorId!: number;
  @Output() bookAppointment = new EventEmitter<number>();
  @Output() back = new EventEmitter<void>();

  doc: any;
  error = '';

  
bookNow() {
  this.bookAppointment.emit(this.doctorId);
}

  constructor(private api: Api) {}

  ngOnInit() {
    if (this.doctorId) {
      this.api.get(`/PatientProfile/getdoc/${this.doctorId}`).subscribe({
        next: (p: any) => {
          this.doc = {
            doctorId: p.userId,
            specialization: p.dd.specialization,
            qualifications: p.dd.qualifications,
            experience: p.dd.experience,
            name: 'Doctor ' + p.firstName,
            email: p.email,
            rating: p.dd.rating,
            description: p.dd.description,
          };
        },
        error: () => (this.error = 'Failed to load doctor profile'),
      });
    }
  }

  goBack() {
    this.back.emit();
  }
}
