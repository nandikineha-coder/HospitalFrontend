
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  doctors: any[] = [];
  patients: any[] = [];
  selectedOption = 'assign-role';
  showOnlyUnassigned = true;

  // New properties for filter and search
  searchQuery: string = '';
  selectedRole: string = '';

  constructor(private api: Api) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Load all users
  loadUsers() {
    this.api.get('/User/getall').subscribe({
      next: (res: any) => {
        this.users = res;
        this.filteredUsers = res; // Initially show all users
      },
      error: (err) => {
        console.error('Failed to load users', err);
      }
    });
  }

  // Filter by role using backend query param
  filterByRole() {
    if (this.selectedRole) {
      this.api.get(`/User/getall?role=${this.selectedRole}`).subscribe({
        next: (res: any) => {
          this.filteredUsers = res;
        },
        error: (err) => {
          console.error('Failed to filter users', err);
        }
      });
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  // Search users by name or email
  searchUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  }

  // Show only unassigned users
  showUnassignedUsers() {
    this.showOnlyUnassigned = true;
    this.filteredUsers = this.users.filter(user =>
      user.role === '0' || user.role === null || user.role === ''
    );
  }

  // Show all users
  showAllUsers() {
    this.showOnlyUnassigned = false;
    this.filteredUsers = [...this.users];
  }

  // Assign role to user
  assignRole(userId: number, role: string) {
    this.api.post(`/User/${userId}/role`, { role }).subscribe({
      next: () => {
        alert(`Role updated to ${role}`);
        this.activateUser(userId);
      },
      error: (err) => {
        console.error('Failed to update role', err);
      }
    });
  }

  // Activate user after assigning role
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

  // Sidebar navigation
  selectOption(option: string) {
    this.selectedOption = option;
    if (option === 'doctor') {
      this.loadDoctors();
    }
    if (option === 'patient') {
      this.loadPatients();
    }
  }

  // Load doctors list
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

  // Load patients list
  loadPatients() {
    this.api.get('/User/patients').subscribe({
      next: (res: any) => {
        this.patients = res;
      },
      error: (err) => {
        console.error('Failed to load patients', err);
      }
    });
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    alert('Logged out successfully');
    window.location.href = '/login';
  }
}
