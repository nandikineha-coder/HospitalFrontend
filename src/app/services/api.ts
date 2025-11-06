import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'https://localhost:7192/api'; // Update if needed

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(payload: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/login`, payload, { responseType: 'text'});
}

get(url: string) {
  return this.http.get(this.baseUrl + url);
}

post(url: string, body: any) {
  return this.http.post(this.baseUrl + url, body);
}



getPatientProfile(id: number) {
  return this.http.get(`/api/PatientProfile/get/${id}`);
}

}
``