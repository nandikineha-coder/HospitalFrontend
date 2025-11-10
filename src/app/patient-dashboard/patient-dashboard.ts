
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css'],
})

export class PatientDashboard implements OnInit {
  patientName: string = '';
firstName: string = '';
lastName: string = '';
  selectedOption: string = 'home';
  profileForm!: FormGroup;
  isEditing = false;
  showDetails = false;
  successMessage: string = '';
  bloodGroups: string[] = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
    'A2+', 'A2-', 'A1B+', 'A1B-', 'A2B+', 'A2B-', 'Bombay Blood Group'
  ];


  constructor(private api: Api, private fb: FormBuilder) {}
  

ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.api.getPatientProfile(userId).subscribe((res) => {
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.patientName = res.firstName + ' ' + res.lastName;
 

this.profileForm = this.fb.group({
        email: [res.email],
        phoneNumber: [res.phoneNumber, [Validators.required, Validators.pattern(/^\d{10}$/)]],
        gender: [res.gender, Validators.required],
        dob: [res.dob, Validators.required],
        adress: [res.pp?.adress, [Validators.required, Validators.maxLength(100)]],
        bloodGroup: [res.pp?.bloodGroup, Validators.required],
        emergencyContact: [res.pp?.emergencyContact, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      });
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
    this.api.updatePatientProfile(userId, payload).subscribe(() => {
      this.isEditing = false;
      this.showDetails = true;
      this.profileForm.reset();

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
        doc.text('Patient Profile', 105, 30, { align: 'center' });
        
doc.setFontSize(12);
        doc.text(`Name: ${this.patientName}`, 20, 60);
        doc.text(`Email: ${this.profileForm.get('email')?.value}`, 20, 70);
        doc.text(`Phone: ${this.profileForm.get('phoneNumber')?.value}`, 20, 80);
        doc.text(`Gender: ${this.profileForm.get('gender')?.value}`, 20, 90);
        doc.text(`DOB: ${this.profileForm.get('dob')?.value}`, 20, 100);
        
doc.text(`Address: ${this.profileForm.get('adress')?.value}`, 20, 110);
        doc.text(`Blood Group: ${this.profileForm.get('bloodGroup')?.value}`, 20, 120);
        doc.text(`Emergency Contact: ${this.profileForm.get('emergencyContact')?.value}`, 20, 130);

        
// Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      const today = new Date().toLocaleDateString();
      doc.text(`Generated on: ${today}`, 20, 280);
      doc.text(`Contact: +91-9876543210 | Happy Health Hospital`, 20, 290);

        
doc.save('Patient_Profile.pdf');
      };
    };
  }

  selectOption(option: string):void{
    this.selectedOption = option;
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}
