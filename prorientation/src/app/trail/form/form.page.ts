import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  constructor(private storage: Storage, private  router:  Router) { }

  ngOnInit() {
  }

  creerTrail(form){
    this.router.navigateByUrl('trail/map');
  }

}
