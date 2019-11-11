import { Component, OnInit } from '@angular/core';
import 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import 'leaflet-routing-machine';
declare let L;



import * as Gp from 'geoportal-access-lib/dist/GpServices.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  text="custom"
  constructor() {

  }
  //var mymap = L.map('mapid').setView([51.505, -0.09], 13);
  change(e){
    this.text=e;
  }

  ngOnInit() {

    var object = new Geolocation();
    object.getCurrentPosition().then((resp) => {
      var lat=resp.coords.latitude
      var long=resp.coords.longitude
      var mymap = L.map('mapid').setView([lat, long], 13);
      mymap.locate({
        watch:true,

      });

      let watch = object.watchPosition();
      watch.subscribe((data) => {
       //data can be a set of coordinates, or an error (if an error occurred).
       console.log(data.coords.latitude)
       console.log(data.coords.longitude)
       var marker = L.marker([lat, long]).addTo(mymap);

     });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
   	    maxZoom: 18,
   	    id: 'mapbox.streets',
   	    accessToken: 'pk.eyJ1IjoibHVjYXNib3V2YXJlbCIsImEiOiJjazJycHIwbXQwZGs3M25udmltaGg3eTFlIn0.XGIAxbBH8QGE1ZnmHUztMQ'
      }).addTo(mymap)
      L.Routing.control({
        waypoints: [
        L.latLng(lat, long),
        L.latLng(lat+0.4, long+0.7)
        ],
        routeWhileDragging: true
      }).addTo(mymap);
      L.Control.Geocoder.nominatim();



/*
     mymap.dragging.disable();
      mymap.touchZoom.disable();
      mymap.doubleClickZoom.disable();
      mymap.scrollWheelZoom.disable();
      mymap.boxZoom.disable();
      mymap.keyboard.disable();*/
    }).catch((error) => {
      console.log('Error getting location', error);
    });


  }

}
