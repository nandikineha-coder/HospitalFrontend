
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'https://localhost:7192/api';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, payload, { responseType: 'text' });
  }

  get(url: string): Observable<any> {
    return this.http.get(this.baseUrl + url);
  }

  post(url: string, body: any): Observable<any> {
    return this.http.post(this.baseUrl + url, body);
  }

  
getUsers(role?: string, active?: boolean) {
  let params: any = {};
  if (role) params.role = role;
  if (active !== undefined) params.active = active;
  return this.http.get<any[]>('/api/User/getall', { params });
}

  getPatientProfile(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/patientprofile/get/${id}`);
  }

updatePatientProfile(id: number, data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/patientprofile/update/${id}`, data);
}

getDoctorProfile(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/doctorprofile/get/${id}`);
}

updateDoctorProfile(id: number, data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/doctorprofile/update/${id}`, data);
}


setDoctorAvailability(docId: number, data: any): Observable<any> {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  return this.http.post(`${this.baseUrl}/DoctorScheduler/${docId}/create`, data, { headers });
}


getDoctorAvailability(docId: number): Observable<any> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${this.baseUrl}/DoctorScheduler/get/${docId}`, { headers });
  }

  
deleteDoctorAvailability(scheduleId: number): Observable<any> {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  return this.http.delete(`${this.baseUrl}/DoctorScheduler/${scheduleId}/delete`, { headers });
}


updateDoctorAvailability(scheduleId: number, data: any): Observable<any> {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  return this.http.put(`${this.baseUrl}/DoctorScheduler/${scheduleId}/update`, data, { headers });
}

getAppointments(params: any) {
  const query = new URLSearchParams(params).toString();
  return this.http.get<any[]>(`/api/appointment/getall?${query}`);
}

cancelAppointment(id: number) {
  return this.http.post(`/api/appointment/${id}/cancel`, {});
}

rescheduleAppointment(id: number, payload: any) {
  return this.http.post(`/api/appointment/${id}/reschedule`, payload);
}





}
