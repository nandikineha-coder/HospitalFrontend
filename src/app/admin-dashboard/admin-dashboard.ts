import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  doctors: any[] = [];
  selectedOption = 'assign-role';
  showOnlyUnassigned = true;

  constructor(private api: Api) {}

  ngOnInit() {
    this.loadUsers();
  }


  loadUsers() {
    this.api.get('/User/getall').subscribe({
      next: (res: any) => {
        this.users = res;
        this.showUnassignedUsers();
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  
loadDoctors() {
  this.api.get('/User/doctors').subscribe({
    next: (res: any) => {
      this.doctors = res;
    },
    error: (err) => {
      console.error('Failed to load doctors', err);
    }
  });
}


  showUnassignedUsers(){
    this.showOnlyUnassigned = true;
    this.filteredUsers = this.users.filter(user => user.role === '0' || user.role === null || user.role === '');
  }

  showAllUsers(){
    this.showOnlyUnassigned = false;
    this.filteredUsers = [...this.users];
  }

  assignRole(userId: number, role: string) {
    this.api.post(`/User/${userId}/role`, { role }).subscribe({
      next: () => {
        alert(`Role updated to ${role}`);
        const user = this.users.find(u => u.id === userId);
        if(user){
          user.assignedRole = role;
          this.activateUser(userId);
        }
      },
      error: (err) => {
        console.error('Failed to update role', err);
      }
    });
  }

  activateUser(userId: number) {
    this.api.post(`/User/${userId}/activate`, {}).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to activate user', err);
      }
    });
  }

  selectOption(option: string) {
    this.selectedOption = option;
    if(option === 'doctor'){
      this.loadDoctors();
    }
  }

  logout() {
    localStorage.removeItem('token');
    alert('Logged out successfully');
    window.location.href = '/login';
  }
}
