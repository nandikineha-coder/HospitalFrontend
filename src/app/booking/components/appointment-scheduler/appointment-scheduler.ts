
import { Component, OnInit } from '@angular/core';
import { Api } from '../../../services/api';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

type Slot = { time: string; disabled: boolean };

@Component({
  selector: 'app-appointment-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-scheduler.html',
  styleUrls: ['./appointment-scheduler.css'], // fixed
})
export class AppointmentScheduler implements OnInit {
  doctorId!: number;
  patientId!: number; // read from profile or token subject
  selectedDate = this.todayStr(); // yyyy-MM-dd
  durationMinutes = 30;
  slots: Slot[] = [];
  selectedTime = '';
  notes = '';
  loading = false;
  booking = false;
  error = ''; success = '';

  constructor(private api: Api, private ar: ActivatedRoute) { }

  ngOnInit() {
    this.doctorId = Number(this.ar.snapshot.params['userId']);
    // TODO: set patientId from your user session/profile (e.g., decode JWT "sub")
    const sub = this.getStoredUserId();
    this.patientId = sub || 0;
    this.loadSlots();
  }

  getStoredUserId(): number | null {
    const raw = localStorage.getItem('userId');
    if (raw == null) return null;
    const num = Number(raw);
    return Number.isNaN(num) ? null : num;
  }


  prettyDate(d: string) {
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  timeZoneId(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  todayStr(): string {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, '0');
    const dd = String(t.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  decodeSub(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const payload = JSON.parse(atob(parts[1]));
      const sub = payload.sub ?? payload.nameid; // depending on your claim
      return Number(sub);
    } catch { return null; }
  }

  /** Build a local Date from yyyy-MM-dd and HH:mm (no timezone suffix). */
  private localDateFrom(date: string, hhmm: string): Date {
    const [hh, mm] = hhmm.split(':').map(Number);
    // Construct local time; do NOT append Z (keeps it in user's local tz)
    return new Date(`${date}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00`);
  }

  /** Enumerate **start times** (HH:mm) of slots within [start, end) in local time. */
  enumerateSlots(date: string, startHHmm: string, endHHmm: string, stepMin: number): string[] {
    const start = this.localDateFrom(date, startHHmm);
    const end = this.localDateFrom(date, endHHmm);
    const out: string[] = [];
    const slot = new Date(start);
    // We push slots whose [slot, slot+step) stays within [start, end)
    while (slot.getTime() + stepMin * 60000 <= end.getTime()) {
      out.push(slot.toTimeString().slice(0, 5));
      slot.setMinutes(slot.getMinutes() + stepMin);
    }
    return out;
  }

  /** Overlap check: [aStart, aEnd) overlaps [bStart, bEnd) if aStart < bEnd && aEnd > bStart */
  private intervalsOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart < bEnd && aEnd > bStart;
  }

  async loadSlots() {
    this.loading = true; this.error = ''; this.success = ''; this.selectedTime = '';
    const tz = this.timeZoneId();
    const date = this.selectedDate; // yyyy-MM-dd

    // 1) Fetch doctor’s availability windows for this date (server returns local TimeOnly in strings)
    // Adjust to your actual endpoint casing/routes:
    const sched$ = this.api.get(`/DoctorScheduler/get/${this.doctorId}/?fromdate=${date}&todate=${date}`);

    // 2) Fetch existing appointments for this doctor on that UTC day to mark busy slots
    // Use UTC day range:
    const startUtc = new Date(date + 'T00:00:00Z').toISOString();
    const endUtc = new Date(date + 'T23:59:59Z').toISOString();
    const appts$ = this.api.get(`/Appointment/getall/?docId=${this.doctorId}&fromUtc=${startUtc}&toUtc=${endUtc}`);

    try {
      const [windows, appointments]: any = await Promise.all([
        firstValueFrom(sched$),
        firstValueFrom(appts$)
      ]);

      // Build available slot grid from windows
      const slotSet = new Set<string>();
      for (const w of windows) {
        const start = this.parseTime(w.startTime); // "HH:mm:ss" -> "HH:mm"
        const end = this.parseTime(w.endTime);
        this.enumerateSlots(date, start, end, this.durationMinutes)
          .forEach(t => slotSet.add(t));
      }
      const sorted = Array.from(slotSet.values()).sort((a, b) => a.localeCompare(b));
      this.slots = sorted.map(t => ({ time: t, disabled: false }));

      // If no slots, nothing to disable
      if (!this.slots.length) {
        return;
      }

      // Compute the visible day window in local time: [00:00, 24:00)
      const dayStartLocal = new Date(`${date}T00:00:00`);
      const dayEndLocal = new Date(`${date}T23:59:59.999`);

      // For each appointment, convert UTC -> local and clamp to the selected day, then mark overlapping slots.
      for (const a of appointments) {
        const apptStartLocal = this.parseServerUtc(a.startUtc);
        const apptEndLocal = this.parseServerUtc(a.endUtc);
        // const apptStartLocal = new Date(a.startUtc); // Parsed as local time value of the UTC instant
        // const apptEndLocal = new Date(a.endUtc);
        console.log(apptStartLocal, apptEndLocal);
        // Clamp to visible day
        const busyStart = apptStartLocal < dayStartLocal ? dayStartLocal : apptStartLocal;
        const busyEnd = apptEndLocal > dayEndLocal ? dayEndLocal : apptEndLocal;

        if (busyStart >= busyEnd) continue; // no effect on this day

        // Disable slots whose [slotStart, slotEnd) overlaps [busyStart, busyEnd)
        this.slots = this.slots.map(s => {
          if (s.disabled) return s;
          const slotStart = this.localDateFrom(date, s.time);
          const slotEnd = new Date(slotStart.getTime() + this.durationMinutes * 60000);
          const disabled = this.intervalsOverlap(slotStart, slotEnd, busyStart, busyEnd);
          return { ...s, disabled };
        });
      }
    } catch (e: any) {
      console.error(e);
      this.error = 'Failed to load availability';
    } finally {
      this.loading = false;
    }
  }

  parseTime(t: string): string {
    // API returns "HH:MM:SS" for TimeOnly; convert to "HH:MM"
    return t?.slice(0, 5);
  }

  private parseServerUtc(ts: string): Date {
    // If already has 'Z' or an explicit offset, parse normally
    if (/[zZ]|[+\-]\d{2}:\d{2}$/.test(ts)) return new Date(ts);
    // Otherwise, enforce UTC by appending 'Z'
    return new Date(ts + 'Z');
  }

  selectSlot(s: Slot) { if (!s.disabled) this.selectedTime = s.time; }

  async book() {
    if (!this.selectedTime) return;
    this.booking = true; this.error = ''; this.success = '';
    const tz = this.timeZoneId();

    const startLocalIso = `${this.selectedDate}T${this.selectedTime}:00`; // local, no 'Z'
    const payload = {
      patientId: this.patientId,
      doctorId: this.doctorId,
      // serviceId: null,         // remove if your backend DTO doesn't have it
      startLocal: startLocalIso,  // backend expects local DateTime (unspecified)
      durationMinutes: this.durationMinutes,
      timeZoneId: tz,
      notes: this.notes || null // remove if not supported on backend
    };

    // Ensure the API path matches the controller route: typically '/api/Appointment/book'
    this.api.post('/Appointment/book', payload).subscribe({
      next: (_res: any) => {
        this.success = 'Appointment booked successfully';
        this.booking = false;
        this.loadSlots();
      },
      error: (err) => {
        this.error = err?.error || 'Failed to book';
        this.booking = false;
      }
    });
  }
}
