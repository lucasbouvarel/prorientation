import { Component, OnInit } from '@angular/core';
import 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import 'leaflet-routing-machine';
import 'leaflet-overpass-layer';
declare let L;
declare var require: any;
import * as request from "request-promise"

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  constructor() {

  }
  //var mymap = L.map('mapid').setView([51.505, -0.09], 13);

  ngOnInit() {

    var object = new Geolocation();
    //object.getCurrentPosition().then((resp) => {
      var lat=45.75
      var long=4.84
      var mymap = L.map('mapid').setView([lat, long], 14);
      /*mymap.locate({
        watch:true,

      });*/

      /*let watch = object.watchPosition();
      watch.subscribe((data) => {
       //data can be a set of coordinates, or an error (if an error occurred).
       console.log(data.coords.latitude)
       console.log(data.coords.longitude)
       var marker = L.marker([lat, long]).addTo(mymap);

     });*/
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
   	    maxZoom: 18,
   	    id: 'mapbox.streets',
   	    accessToken: 'pk.eyJ1IjoibHVjYXNib3V2YXJlbCIsImEiOiJjazJycHIwbXQwZGs3M25udmltaGg3eTFlIn0.XGIAxbBH8QGE1ZnmHUztMQ'
      }).addTo(mymap)
      //console.log(mymap.getBound())
      /*L.Routing.control({
        waypoints: [
        L.latLng(lat, long),
        L.latLng(lat+0.4, long+0.7)
        ],
        routeWhileDragging: true
      }).addTo(mymap);*/
      /*var attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
      attr_overpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';
      var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {opacity: 0.7, attribution: [attr_osm, attr_overpass].join(', ')});

      var map = new L.Map('map').addLayer(osm).setView(new L.LatLng(52.265, 10.524), 14);*/



      var opl = new L.OverPassLayer({
        endpoint: "http://overpass.osm.rambler.ru/cgi/",
        query:"(node({{bbox}})[tourism];);out qt;",
        debug: false,
        callback: function(data) {
          var tableau=new Array()
          for(var i=0;i<data.elements.length;i++) {
            tableau[i]=new Array()
            var e = data.elements[i];

            if (e.id in this.instance._ids) return;
            console.log(e.tags.tourism)
            if(e.tags.tourism!="hotel"){

              tableau[i][0]=e.lat
              tableau[i][1]=e.long
              this.instance._ids[e.id] = true;
              var pos = new L.LatLng(e.lat, e.lon);
              var popup = this.instance._poiInfo(e.tags,e.id);
              var color = e.tags.collection_times ? 'green':'red';
              var circle = L.circle(pos, 50, {
                color: color,
                fillColor: '#fa3',
                fillOpacity: 0.5
              })
              .bindPopup(popup);
              this.instance.addLayer(circle);
            }
          }
        },
        minZoomIndicatorOptions: {
          position: 'topright',
          minZoomMessageNoLayer: "no layer assigned",
          minZoomMessage: "current Zoom-Level: CURRENTZOOM all data at Level: MINZOOMLEVEL"
        }
      });
      mymap.addLayer(opl);
      //L.Control.Geocoder.nominatim();



/*
     mymap.dragging.disable();
      mymap.touchZoom.disable();
      mymap.doubleClickZoom.disable();
      mymap.scrollWheelZoom.disable();
      mymap.boxZoom.disable();
      mymap.keyboard.disable();*/
    /*}).catch((error) => {
      console.log('Error getting location', error);
    });*/


  }

}
