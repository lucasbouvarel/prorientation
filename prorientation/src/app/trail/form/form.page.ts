import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { Storage } from '@ionic/storage';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  distance: number = 0;

  constructor(private storage: Storage, private  router:  Router) { }

  ngOnInit() {
  }

  async creerTrail(form){
    await this.storage.set(`distanceCoursePied`,form.value.distance);
    this.router.navigateByUrl('trail/map');
  }

}
