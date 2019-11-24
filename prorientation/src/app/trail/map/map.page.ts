import { Component, OnInit } from '@angular/core';
import 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import 'leaflet-routing-machine';
declare let L;
import { mapbox } from 'lrm-mapbox';



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

    function zeros(dimensions) {
      var array = [];

      for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
      }

      return array;
    }

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
        var marker = L.marker([lat, long]).addTo(mymap);
      });


      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
   	    maxZoom: 18,
   	    id: 'mapbox.streets',
   	    accessToken: 'pk.eyJ1IjoibHVjYXNib3V2YXJlbCIsImEiOiJjazJycHIwbXQwZGs3M25udmltaGg3eTFlIn0.XGIAxbBH8QGE1ZnmHUztMQ'
      }).addTo(mymap);

      var arrayCoords = zeros([4, 2]);

      arrayCoords[0][0] = 45.763525;
      arrayCoords[0][1] = 4.844971;
      arrayCoords[1][0] = 45.765752;
      arrayCoords[1][1] = 4.841538;
      arrayCoords[2][0] = 45.781612;
      arrayCoords[2][1] = 4.881176;
      arrayCoords[3][0] = 45.780460;
      arrayCoords[3][1] = 4.873430;

      function tsp(arrayCoords){

        return new Promise( function(resolve,reject){

          var urlCoords = '';
          var i;
          for (i = 0; i < arrayCoords.length; i++) {
            urlCoords += arrayCoords[i][0] + ',' + arrayCoords[i][1];
            if(i != arrayCoords.length - 1){
              urlCoords += ';'
            }
          }

          var url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/walking/' + urlCoords + '?annotations=distance&access_token=pk.eyJ1IjoiYWRlam9uZ2hlIiwiYSI6ImNrMzl3eTFmeDAydTYzY21nZ3RoY3MwdTEifQ.vnvS6h87mJWeRuwjiWglrg';
          console.log(url);

          var req = new XMLHttpRequest();
          req.responseType = 'json';
          req.open('GET', url, true);
          req.send(null);

          var distancesResponse;

          req.addEventListener('readystatechange', function() {
            if (req.readyState === XMLHttpRequest.DONE) {
              req.onload = function () {
                  var jsonResponse = req.response;
                  var distances = jsonResponse.distances;
                  var urlDistances = 'http://51.91.111.135:8080/';

                  var formData = new FormData();
                  formData.append('dist', distances);
                  var reqDistances = new XMLHttpRequest();
                  reqDistances.responseType = "json";
                  reqDistances.open('POST', urlDistances, true);
                  reqDistances.send(formData);

                  reqDistances.addEventListener('readystatechange', function() {
                    if(reqDistances.readyState === XMLHttpRequest.DONE) {
                      reqDistances.onload = function () {
                        distancesResponse = reqDistances.response;

                        var intDistances = []
                        var j;
                        for(j=0;j < distancesResponse.length ; j++){
                          var integer = parseInt(distancesResponse[j], 10);
                          intDistances.push(integer)
                        }

                        if(distancesResponse === undefined){
                          reject("erreur");
                        }else{
                          resolve(intDistances);
                        }
                      }
                    }
                 });
              }
            }
          });
        });
      }

      tsp(arrayCoords).then((res)=>{
        console.log(res);


        let options = { profile: 'mapbox/walking' };

        var routeControl = L.Routing.control({
          waypoints: [
            L.latLng(arrayCoords[res[0]][0], arrayCoords[res[0]][1]),
            L.latLng(arrayCoords[res[1]][0], arrayCoords[res[1]][1]),
            L.latLng(arrayCoords[res[2]][0], arrayCoords[res[2]][1]),
            L.latLng(arrayCoords[res[3]][0], arrayCoords[res[3]][1]),
            L.latLng(arrayCoords[res[0]][0], arrayCoords[res[0]][1]),
          ],

          router: new L.Routing.mapbox('pk.eyJ1IjoiYWRlam9uZ2hlIiwiYSI6ImNrMzl3eTFmeDAydTYzY21nZ3RoY3MwdTEifQ.vnvS6h87mJWeRuwjiWglrg', options),

          routeWhileDragging: true
        }).addTo(mymap);
      });




    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
