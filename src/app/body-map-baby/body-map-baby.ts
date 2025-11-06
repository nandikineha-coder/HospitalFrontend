import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-body-map-baby',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './body-map-baby.html',
  styleUrl: './body-map-baby.css',
})
export class BodyMapBaby {
  constructor(private router: Router){}

  goBack(){
    this.router.navigate(['/patient-dashboard']);
  }

}
