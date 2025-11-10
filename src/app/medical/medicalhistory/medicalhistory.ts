import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
interface Doctor {
  doctorId: number;
  firstName: string;
  lastName: string;
}

interface Medication {
  medId?: number;
  historyId: number;
  drugName: string;
  dosage: string;
  duration: string;
}

interface MedicalHistory {
  historyId: number;
  patientId: number;
  doctorId: number | null;
  doctorName: string | null;
  recordDate: string; // C# DateTime maps to string in TypeScript/JSON
  diagnosis: string | null;
  treatment: string | null;
  doctor?: Doctor; // Navigation property for Doctor details
  medications?: Medication[]; // Navigation property for Medications
}
interface UpsertHistoryDto {
  PatientId: number | null;
  DoctorName: string | null;
  Diagnosis: string | null;
  Treatment: string | null;
}
@Component({
  selector: 'app-medicalhistory',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './medicalhistory.html',
  styleUrl: './medicalhistory.css',
})
export class Medicalhistory implements OnInit {
  searchTerm: any;
  filterDate: any;
  loading: boolean = true;
  userId: number | null = null;
  //history: any[] = [];
  medicalHistories: any[] = [];
  filteredHistories: MedicalHistory[] = [];
  showMedicationModal: boolean = false;
  selectedMedication: Medication | null = null;
  showRecordModal: boolean = false;
  newRecord: UpsertHistoryDto = {
    PatientId: this.userId,
    DoctorName: null, // Pre-populate with current doctor ID
    Diagnosis: null,
    Treatment: null,
  };
  // API Endpoints
  private readonly historyApiUrl = '/MedicalHistory';

  // Inject HttpClient to make API calls
  constructor(private http: HttpClient, private api: Api) {
    this.userId = Number(localStorage.getItem('userId'));
  }

  ngOnInit(): void {
    this.fetchMedicalHistories();

  }
  fetchMedicalHistories() {
    this.loading = true;

    // API Call: The <MedicalHistory[]> generic type is used here for type safety.
    this.api.get(this.historyApiUrl + `/get/${this.userId}`)
      .subscribe({
        next: (data: any) => {
          this.medicalHistories = data;
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching medical histories:', err);
          this.loading = false;
          // Implement user feedback on failure here
        }
      });
  }
  applyFilters() {
    let tempHistories = this.medicalHistories;

    // Filter by Search Term (Diagnosis or Treatment)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      tempHistories = tempHistories.filter(history =>
        history.diagnosis?.toLowerCase().includes(term) ||
        history.treatment?.toLowerCase().includes(term)
      );
    }
    // Filter by Date
    if (this.filterDate) {
      const filterDay = new Date(this.filterDate).toDateString();
      tempHistories = tempHistories.filter(history => {
        // Compare the date part only
        const recordDay = new Date(history.recordDate).toDateString();
        return recordDay === filterDay;
      });
    }

    this.filteredHistories = tempHistories;
  }
  addRecord() {
    // Reset the form model and show the modal
    this.newRecord = {
      PatientId: this.userId,
      DoctorName: null,
      Diagnosis: null,
      Treatment: null,
    };
    this.showRecordModal = true;
  }
  closeRecordModal() {
    this.showRecordModal = false;
  }
  editRecord(history: MedicalHistory) {
    console.log('Edit Record functionality for ID:', history.historyId);
  }
  submitRecord() {
    if (!this.newRecord.Diagnosis || !this.newRecord.DoctorName) {
      alert('Diagnosis and Doctor ID are required.');
      return;
    }
    this.api.post(`/MedicalHistory/create`, this.newRecord).subscribe({
      next: (res: any) => {
        console.log('Record added successfully:', res);
        this.closeRecordModal();
        this.fetchMedicalHistories();
      },
      error: (err: any) => {
        console.error('Failed to add record:', err);
        alert('Failed to add record. Check API endpoint.');
      }
    })
  }
  viewRecord(history: MedicalHistory) {
    console.log('View Record details for ID:', history.historyId);
  }
  deleteRecord(history: MedicalHistory) {
    if (confirm(`Are you sure you want to delete record #${history.historyId}?`)) {
      this.http.delete(`${this.historyApiUrl}/${history.historyId}`)
        .subscribe({
          next: () => {
            console.log(`Record ${history.historyId} deleted.`);
            // Optimistically update the list by refreshing the data
            this.fetchMedicalHistories();
          },
          error: (err) => {
            console.error('Failed to delete record:', err);
            alert('Failed to delete record. Check API endpoint.');
          }
        });
    }
  }

  /**
   * Handles the click event for viewing medication details.
   */
  viewMedication(med: Medication) {
    // Set the medication data and show the modal
    this.selectedMedication = med;
    this.showMedicationModal = true;
  }

  /**
   * Called to close the modal.
   */
  closeMedicationModal() {
    this.showMedicationModal = false;
    this.selectedMedication = null;
  }

  editMedication() {
    alert(`Edit medication functionality for: ${this.selectedMedication?.drugName}`);
    // In a real app, this would navigate to an edit form or display another modal
    this.closeMedicationModal();
  }

  deleteMedication() {
    if (confirm(`Are you sure you want to delete ${this.selectedMedication?.drugName}?`)) {
      // Placeholder for API call to delete medication
      alert(`Medication ${this.selectedMedication?.drugName} deleted (mock API call)`);
      this.closeMedicationModal();
      // After a real API delete, you should refresh the list: this.fetchMedicalHistories();
    }
  }
}
