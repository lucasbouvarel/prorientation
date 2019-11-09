import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  text="default text";
  constructor(private router:Router) {}
  onChangeText(){
    this.text="changed"
  }
  go(){
    this.router.navigate(['/map']);
  }



}
