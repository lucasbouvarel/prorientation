import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router:Router) {}

  navigateOrientation(){
    this.router.navigate(['orientation/form']);
  }

  navigateTrail(){
    this.router.navigate(['trail/form']);
  }

  navigatePerso(){
    this.router.navigate(['perso']);
  }



}
