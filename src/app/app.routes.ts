import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { Register } from './register/register';
import { Login } from './login/login';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { DoctorDashboard } from './doctor-dashboard/doctor-dashboard';
import { PatientDashboard } from './patient-dashboard/patient-dashboard';
import { AppointmentScheduler } from './booking/components/appointment-scheduler/appointment-scheduler';
import { BookingResults } from './booking/components/booking-results/booking-results';
import { BookingSearch } from './booking/components/booking-search/booking-search';
import { DoctorProfile } from './booking/components/doctor-profile/doctor-profile';


export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'admin-dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboard), canActivate: [AuthGuard] },
  { path: 'doctor-dashboard', loadComponent: () => import('./doctor-dashboard/doctor-dashboard').then(m => m.DoctorDashboard), canActivate: [AuthGuard] },
  { path: 'patient-dashboard', loadComponent: () => import('./patient-dashboard/patient-dashboard').then(m => m.PatientDashboard), canActivate: [AuthGuard] },
  { path: 'baby-body-map', loadComponent: () => import('./body-map-baby/body-map-baby').then(m => m.BodyMapBaby), canActivate: [AuthGuard] },
  { path: 'male-body-map', loadComponent: () => import('./body-map-male/body-map-male').then(m => m.BodyMapMale), canActivate: [AuthGuard] },
  { path: 'female-body-map', loadComponent: () => import('./body-map-female/body-map-female').then(m => m.BodyMapFemale), canActivate: [AuthGuard] },
  {path:'appointment/:userId',loadComponent:()=>import('./booking/components/appointment-scheduler/appointment-scheduler').then(m=>m.AppointmentScheduler), canActivate: [AuthGuard]},
  {path:'result',loadComponent:()=>import('./booking/components/booking-results/booking-results').then(m=>m.BookingResults), canActivate: [AuthGuard]},
  {path:'search',loadComponent:()=>import('./booking/components/booking-search/booking-search').then(m=>m.BookingSearch), canActivate: [AuthGuard]},
  {path:'profiles/:userId',loadComponent:()=>import('./booking/components/doctor-profile/doctor-profile').then(m=>m.DoctorProfile), canActivate: [AuthGuard]},
  {path:'medical/medicalhistory',loadComponent:()=>import('./medical/medicalhistory/medicalhistory').then(m=>m.Medicalhistory), canActivate: [AuthGuard]},
  {path: 'appointment', component: PatientDashboard},

{
  path: 'patient-dashboard',
  component: PatientDashboard,
  children: [
    {
      path: 'search',
      component: BookingSearch,
      outlet: 'appointmentOutlet'
    },
    {
      path: 'result',
      component: BookingResults,
      outlet: 'appointmentOutlet'
    },
    {
      path: 'doctor/:userId',
      component: DoctorProfile,
      outlet: 'appointmentOutlet'
    }
  ]
}
];