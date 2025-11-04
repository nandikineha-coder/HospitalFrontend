import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { DoctorDashboard } from './doctor-dashboard/doctor-dashboard';
import { PatientDashboard } from './patient-dashboard/patient-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'admin-dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboard) },
  { path: 'doctor-dashboard', loadComponent: () => import('./doctor-dashboard/doctor-dashboard').then(m => m.DoctorDashboard) },
  { path: 'patient-dashboard', loadComponent: () => import('./patient-dashboard/patient-dashboard').then(m => m.PatientDashboard) }
];

// export const routes: Routes = [
//   { path: '', redirectTo: 'register', pathMatch: 'full' },
//   { path: 'register', component: Register },
//   { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
//   { path: 'login', component: Login }
  

// ];