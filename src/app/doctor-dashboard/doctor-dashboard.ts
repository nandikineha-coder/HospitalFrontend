
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl,ValidationErrors} from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './doctor-dashboard.html',
  styleUrls: ['./doctor-dashboard.css'],
})
export class DoctorDashboard implements OnInit {
  doctorName: string = '';
  firstName: string = '';
  lastName: string = '';
  selectedOption: string = 'home';
  profileForm!: FormGroup;
  availabilityForm!: FormGroup;
  isEditing = false;
  showDetails = false;
  successMessage: string = '';
  searchQuery: string = '';
  sortOrder: string = 'asc';
  minDate: string = '';
  maxDate: string = '';
  availabilityList: any[] = [];
  groupedAvailability: { date: string; slots: any[] }[] = [];
  expandedIndex: number | null = null;
  appointments: any[] = [];
  filterFromDate: string = '';
  filterToDate: string = '';


  specilization: string[] = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics',
    'Psychiatry', 'Oncology', 'Radiology', 'General Surgery', 'ENT',
    'Gastroenterology', 'Nephrology', 'Urology', 'Endocrinology', 'Pulmonology',
    'Ophthalmology', 'Gynecology', 'Anesthesiology', 'Pathology', 'Emergency Medicine'
  ];

  constructor(private api: Api, private fb: FormBuilder) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));

    this.api.getDoctorProfile(userId).subscribe((res: any) => {
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.doctorName = `${res.firstName} ${res.lastName}`;

      this.profileForm = this.fb.group({
        email: [res.email],
        phoneNumber: [res.phoneNumber, [Validators.required, Validators.pattern(/^\d{10}$/)]],
        gender: [res.gender, Validators.required],
        dob: [res.dob, Validators.required],
        specilization: [res.pp?.specialization, Validators.required],
        qualifications: [res.pp?.qualifications, [Validators.required, Validators.maxLength(100)]],
        expirence: [res.pp?.experience, [Validators.required, Validators.min(0)]],
        emergencyContact: [res.pp?.emergencyContact, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      });

      const today = new Date();
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(today.getDate() + 2);

      this.minDate = today.toISOString().split('T')[0];
      this.maxDate = dayAfterTomorrow.toISOString().split('T')[0];

      this.availabilityForm = this.fb.group({
        availableDate: ['', [Validators.required, this.dateRangeValidator.bind(this)]],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required]
      });

      this.loadAvailability();
    });
  }

  enableEdit(): void {
    this.isEditing = true;
    this.showDetails = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveProfile(): void {
    const userId = Number(localStorage.getItem('userId'));
    const payload = this.profileForm.value;

    this.api.updateDoctorProfile(userId, payload).subscribe(() => {
      this.isEditing = false;
      this.showDetails = true;
      this.successMessage = 'Details saved successfully!';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    });
  }

  downloadProfilePdf(): void {
    const doc = new jsPDF();
    const img = new Image();
    img.src = 'assets/who.png';
    img.onload = () => {
      doc.addImage(img, 'PNG', 40, 40, 130, 130, '', 'FAST');

      const logo = new Image();
      logo.src = 'assets/logo.png';
      logo.onload = () => {
        doc.addImage(logo, 'PNG', 10, 10, 30, 30);

        doc.setFontSize(18);
        doc.text('Happy Health Hospital', 105, 20, { align: 'center' });
        doc.setFontSize(16);
        doc.text('Doctor Profile', 105, 30, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Name: ${this.doctorName}`, 20, 60);
        doc.text(`Email: ${this.profileForm.get('email')?.value}`, 20, 70);
        doc.text(`Phone: ${this.profileForm.get('phoneNumber')?.value}`, 20, 80);
        doc.text(`Gender: ${this.profileForm.get('gender')?.value}`, 20, 90);
        doc.text(`DOB: ${this.profileForm.get('dob')?.value}`, 20, 100);
        doc.text(`Specialization: ${this.profileForm.get('specialization')?.value}`, 20, 110);
        doc.text(`Qualification: ${this.profileForm.get('qualification')?.value}`, 20, 120);
        doc.text(`Experience: ${this.profileForm.get('experience')?.value} years`, 20, 130);

        doc.setFontSize(10);
        doc.setTextColor(100);
        const today = new Date().toLocaleDateString();
        doc.text(`Generated on: ${today}`, 20, 280);
        doc.text(`Contact: +91-9876543210 | Happy Health Hospital`, 20, 290);

        doc.save('Doctor_Profile.pdf');
      };
    };
  }

  
submitAvailability(): void {
  // Validate form before submission
  if (this.availabilityForm.invalid) {
    this.successMessage = 'Please fill all fields correctly.';
    return;
  }

  const doctorId = Number(localStorage.getItem('userId'));
  const formValue = this.availabilityForm.value;

  const payload = {
    AvailableDate: formValue.availableDate,
    StartTime: formValue.startTime,
    EndTime: formValue.endTime,
    IsAvailable: true
  };

  const editId = localStorage.getItem('editScheduleId');

  console.log('Submitting availability...');
  console.log('Edit ID:', editId);
  console.log('Payload:', payload);

  if (editId) {
    // Update existing slot
    this.api.updateDoctorAvailability(Number(editId), payload).subscribe({
      next: () => {
        this.successMessage = 'Slot updated successfully!';
        localStorage.removeItem('editScheduleId');
        this.availabilityForm.reset();
        this.loadAvailability();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Update error:', err);
        this.successMessage = 'Failed to update slot. Please refresh and try again.';
      }
    });
  } else {
    // Create new slot
    this.api.setDoctorAvailability(doctorId, payload).subscribe({
      next: () => {
        this.successMessage = 'Availability set successfully!';
        this.availabilityForm.reset();
        this.loadAvailability();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Set error:', err);
        this.successMessage = 'Failed to set availability. Please refresh and try again.';
      }
    });
  }
}

  loadAvailability(): void {
    const doctorId = Number(localStorage.getItem('userId'));
    this.api.getDoctorAvailability(doctorId).subscribe((res: any[]) => {
      const grouped = res.reduce((acc: any, slot: any) => {
        const date = slot.availableDate;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
      }, {});

      this.groupedAvailability = Object.keys(grouped).map(date => ({
        date,
        slots: grouped[date]
      }));
    });
  }

  
editSlot(slot: any): void {
  const selectedDate = new Date(slot.availableDate);
  const today = new Date();

  // Normalize both dates to midnight for accurate comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    this.successMessage = 'Past availability cannot be edited.';
    setTimeout(() => this.successMessage = '', 3000);
    return;
  }

  this.availabilityForm.patchValue({
    availableDate: slot.availableDate,
    startTime: slot.startTime,
    endTime: slot.endTime
  });
  localStorage.setItem('editScheduleId', slot.scheduleId.toString());
}


 
deleteSlot(scheduleId: number): void {
  const slot = this.groupedAvailability
    .flatMap(group => group.slots)
    .find(s => s.scheduleId === scheduleId);

  if (slot) {
    const selectedDate = new Date(slot.availableDate);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.successMessage = 'Past availability cannot be deleted.';
      setTimeout(() => this.successMessage = '', 3000);
      return;
    }
  }

  if (confirm('Are you sure you want to delete this slot?')) {
    this.api.deleteDoctorAvailability(scheduleId).subscribe({
      next: () => {
        this.successMessage = 'Slot deleted successfully!';
        this.loadAvailability();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.successMessage = err.error || 'Failed to delete slot.';
      }
    });
  }
}


  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 2);

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);

    if (selectedDate < today || selectedDate > maxDate) {
      return { dateOutOfRange: true };
    }
    return null;
  }

  toggleExpand(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  searchAvailability(): void {
    if (this.searchQuery.trim()) {
      this.groupedAvailability = this.groupedAvailability.filter(group =>
        group.date.includes(this.searchQuery.trim())
      );
    } else {
      this.loadAvailability();
    }
  }

  sortAvailability(): void {
    this.groupedAvailability.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.date.localeCompare(b.date);
      } else {
        return b.date.localeCompare(a.date);
      }
    });
  }

  
loadAppointments(): void {
  const doctorId = Number(localStorage.getItem('userId'));
  const params: any = { docId: doctorId };

  if (this.filterFromDate) params.fromUtc = this.filterFromDate;
  if (this.filterToDate) params.toUtc = this.filterToDate;
  
  this.api.getAppointments(params).subscribe({
    next: (res) => this.appointments = res,
    error: (err) => {
      console.error('Error loading appointments', err);
      this.successMessage = 'Failed to load appointments.';
    }
  });
}

cancelAppointment(id: number): void {
  if (confirm('Are you sure you want to cancel this appointment?')) {
    this.api.cancelAppointment(id).subscribe({
      next: () => {
        this.successMessage = 'Appointment cancelled successfully!';
        this.loadAppointments();
        setTimeout(() => this.successMessage = '', 3000);
      },
      
error: (err) => {
        console.error('Cancel error:', err);
        this.successMessage = 'Failed to cancel appointment.';
      }
    });
  }
}


rescheduleAppointment(appt: any): void {
  // You can open a modal or form here to pick new time
  const newStartLocal = prompt('Enter new start time (YYYY-MM-DD HH:mm):');
  const durationMinutes = prompt('Enter duration in minutes:');
  const timeZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (newStartLocal && durationMinutes) {
    
const payload = {
      newStartLocal: new Date(newStartLocal),
      DurationMinutes: Number(durationMinutes),
      TimeZoneId: timeZoneId
    };

    this.api.rescheduleAppointment(appt.appointmentId, payload).subscribe({
      next: () => {
        
this.successMessage = 'Appointment rescheduled successfully!';
        this.loadAppointments();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Reschedule error:', err);
        this.successMessage = err.error || 'Failed to reschedule appointment.';
      }
    });
  }
}

selectOption(option: string): void {
  this.selectedOption = option;
  if (option === 'calender') {
    localStorage.removeItem('editScheduleId');
  }
}
  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}
