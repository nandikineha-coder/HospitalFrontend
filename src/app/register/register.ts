import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, HttpClientModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements AfterViewInit{
  registerForm: FormGroup;

  ngAfterViewInit(): void {
      
      const carouselElement = document.getElementById('hospitalSlides');
      if(carouselElement){
        new bootstrap.Carousel(carouselElement, {
          interval: 3000, ride: 'carousel'
        });
    }
    }

  constructor(private fb: FormBuilder, private api: Api, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
  Validators.required,
  Validators.minLength(10),
  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/)
]],
      // password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get password(){
    return this.registerForm.get('password')
  }

  // ✅ Move this method outside the constructor
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }


onSubmit() {
  if (this.registerForm.valid) {
    const payload = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.api.register(payload).subscribe({
      next: (res: any) => {
        alert('Registration successful!');
        console.log(res);
      },
      error: (err: any) => {
        alert(err.error || 'Registration failed!');
        console.error(err);
      }
    });
  } else {
    alert('Please fill all fields correctly.');
  }
}


capitalizeInput(field: string) {
  const value = this.registerForm.get(field)?.value || '';
  if (value.length > 0) {
    this.registerForm.get(field)?.setValue(
      value.charAt(0).toUpperCase() + value.slice(1),
      { emitEvent: false }
    );
  }
}



goToLogin() {
  this.router.navigate(['/login']);
}
}