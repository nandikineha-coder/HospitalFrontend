import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-body-map-female',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './body-map-female.html',
  styleUrl: './body-map-female.css',
})
export class BodyMapFemale {
  constructor(private router: Router){}

  goBack(){
    this.router.navigate(['/patient-dashboard']);
  }
}
