import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-body-map-male',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './body-map-male.html',
  styleUrl: './body-map-male.css',
})
export class BodyMapMale {
  constructor(private router: Router){}

  goBack(){
    this.router.navigate(['/patient-dashboard']);
  }

}
