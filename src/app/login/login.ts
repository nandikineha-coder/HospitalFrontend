
import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api'; // Your service
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { interval } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements AfterViewInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private api: Api, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {

    const carouselElement = document.getElementById('hospitalSlides');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 3000, ride: 'carousel'
      });
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.api.login(this.loginForm.value).subscribe({
        next: (token: string) => {
          localStorage.setItem('token', token); // Save JWT
          const decoded: any = jwtDecode(token);
          const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
          localStorage.setItem('role', role);
          localStorage.setItem('userId', userId);
          alert('Login successful!');
          // Redirect based on role
          if (role === 'Admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (role === 'Doctor') {
            this.router.navigate(['/doctor-dashboard']);
          } else if (role === 'Patient') {
            this.router.navigate(['/patient-dashboard']);
          } else {
            alert('Unknown role');
          }
        },
        error: (err: any) => {
          alert(err.error || 'Invalid credentials');
        }
      });
    } else {
      alert('Please enter valid credentials.');
    }
  }
}
