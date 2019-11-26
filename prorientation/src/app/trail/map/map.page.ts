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
      var testMap = L.map('mapid1').setView([lat, long], 13);
      mymap.locate({
        watch:true,

      });

      testMap.locate({
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

      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
   	    maxZoom: 18,
   	    id: 'mapbox.streets',
   	    accessToken: 'pk.eyJ1IjoibHVjYXNib3V2YXJlbCIsImEiOiJjazJycHIwbXQwZGs3M25udmltaGg3eTFlIn0.XGIAxbBH8QGE1ZnmHUztMQ'
      }).addTo(testMap);

      var arrayCoords = zeros([4, 2]);

      arrayCoords[0][0] = 45.763525;
      arrayCoords[0][1] = 4.844971;
      arrayCoords[1][0] = 45.765752;
      arrayCoords[1][1] = 4.841538;
      arrayCoords[2][0] = 45.781612;
      arrayCoords[2][1] = 4.881176;
      arrayCoords[3][0] = 45.780460;
      arrayCoords[3][1] = 4.873430;

      function getDistanceMatrix(arrayCoords){
        return new Promise(async function(resolve,reject){
          var i;
          var j;

          var arrayDistances = [];

          for (i = 0; i < arrayCoords.length; i++) {
            for (j = 0; j < arrayCoords.length; j++) {
              var routeControl = await getRouteControl(arrayCoords[i][0], arrayCoords[i][1], arrayCoords[j][0], arrayCoords[j][1]);
              await getDistance(routeControl).then((res)=>{arrayDistances.push(res);});
            }
          }

          if(arrayDistances === undefined){
            reject("erreur");
          }else{
            resolve(arrayDistances);
          }
        });
      }

      function getRouteControl(w,x,y,z){
        return new Promise( function(resolve,reject){

          let options = { profile: 'mapbox/walking' };

          var routeControl = L.Routing.control({
            waypoints: [
              L.latLng(w, x),
              L.latLng(y, z)
            ],

            router: new L.Routing.mapbox('pk.eyJ1IjoiYWRlam9uZ2hlIiwiYSI6ImNrMzl3eTFmeDAydTYzY21nZ3RoY3MwdTEifQ.vnvS6h87mJWeRuwjiWglrg', options),

            routeWhileDragging: true
          }).addTo(testMap);

          if(routeControl === undefined){
            reject("erreur");
          }else{
            resolve(routeControl);
          }
        });
      }

      function getDistance(routeControl){
        return new Promise( function(resolve,reject){
          routeControl.addEventListener('routesfound', function(e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            var dist = summary.totalDistance;

            console.log(dist);

            if(dist >= 0){
              resolve(dist);
            }else{
              reject("erreur");
            }
          })
        });
      }

      function tsp(arrayCoords){

        return new Promise(async function(resolve,reject){

          var matrixD = await getDistanceMatrix(arrayCoords).then((res)=>{

            var distances = zeros([arrayCoords.length, arrayCoords.length]);

            var k;
            var l;
            var index = 0;
            for (k = 0; k < arrayCoords.length; k++) {
              for (l = 0; l < arrayCoords.length; l++) {
                distances[k][l] = res[index];
                index = index +1;
              }
            }

            console.log(distances);

            var distancesResponse;

            var urlDistances = 'http://51.91.111.135:8080/';
            var formData = new FormData();
            formData.append('dist', distances.toString());
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
          });
        });
      }

      tsp(arrayCoords).then((res)=>{
        console.log("res");
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
