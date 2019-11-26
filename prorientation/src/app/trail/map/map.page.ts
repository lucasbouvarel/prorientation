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

      var arrayCoords = zeros([12, 2]);

      arrayCoords[0][0] = lat;
      arrayCoords[0][1] = long;
      arrayCoords[1][0] = 45.772371;
      arrayCoords[1][1] = 4.865946;
      arrayCoords[2][0] = 45.781612;
      arrayCoords[2][1] = 4.881176;
      arrayCoords[3][0] = 45.783816;
      arrayCoords[3][1] = 4.872120;
      arrayCoords[4][0] = 45.774956;
      arrayCoords[4][1] = 4.877648;
      arrayCoords[5][0] = 45.776370;
      arrayCoords[5][1] = 4.872895;
      arrayCoords[6][0] = 45.780380;
      arrayCoords[6][1] = 4.866248;
      arrayCoords[7][0] = 45.779944;
      arrayCoords[7][1] = 4.888361;
      arrayCoords[8][0] = 45.786152;
      arrayCoords[8][1] = 4.876570;
      arrayCoords[9][0] = 45.779589;
      arrayCoords[9][1] = 4.859683;
      arrayCoords[10][0] = 45.771271;
      arrayCoords[10][1] = 4.885133;
      arrayCoords[11][0] = 45.784126;
      arrayCoords[11][1] = 4.865009;
      /*arrayCoords[11][0] = 45.769342;
      arrayCoords[11][1] = 4.896707;
      arrayCoords[13][0] = 45.787324;
      arrayCoords[13][1] = 4.882642;
      /*arrayCoords[14][0] = 45.784035;
      arrayCoords[14][1] = 4.873064;
      arrayCoords[15][0] = 45.784202;
      arrayCoords[15][1] = 4.865068;
      arrayCoords[16][0] = 45.772343;
      arrayCoords[16][1] = 4.866039;
      arrayCoords[17][0] = 45.768562;
      arrayCoords[17][1] = 4.884405;
      arrayCoords[18][0] = 45.769362;
      arrayCoords[18][1] = 4.896638;
      arrayCoords[19][0] = 45.779623;
      arrayCoords[19][1] = 4.859615;*/


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
            var target = 6000;

            var urlDistances = 'http://51.91.111.135:8080/';
            var formData = new FormData();
            formData.append('dist', distances.toString());
            formData.append('distTarget', target.toString());
            var reqDistances = new XMLHttpRequest();
            reqDistances.responseType = "json";
            reqDistances.open('POST', urlDistances, true);
            reqDistances.send(formData);

            reqDistances.addEventListener('readystatechange', function() {
              if(reqDistances.readyState === XMLHttpRequest.DONE) {
                reqDistances.onload = function () {
                  var distancesResponse = reqDistances.response.orders;
                  var eliminatedResponse = reqDistances.response.eliminated;

                  var intDistances = []
                  var j;
                  for(j=0;j < distancesResponse.length ; j++){
                    var integer = parseInt(distancesResponse[j], 10);
                    intDistances.push(integer)
                  }

                  var intEliminated = []
                  for(j=0;j < eliminatedResponse.length ; j++){
                    var integer = parseInt(eliminatedResponse[j], 10);
                    intEliminated.push(integer)
                  }

                  if(distancesResponse === undefined){
                    reject("erreur");
                  }else{
                    resolve([intDistances,intEliminated]);
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

        var order = res[0];
        console.log(order);
        var eliminatedNodes = res[1];
        console.log(eliminatedNodes);


        let options = { profile: 'mapbox/walking' };

        var pointsWay = [];

        var coordConservedNodes = zeros([order.length,2]);

        var i;
        var j;
        var indexNodes = -1;
        for(i=0; i < arrayCoords.length ;i++){
          var bool = 0;
          for(j=0; j < eliminatedNodes.length ;j++){
            if(i == eliminatedNodes[j]){
              bool = 1;
            }
          }
          if(bool == 0){
            indexNodes = indexNodes + 1;
            coordConservedNodes[indexNodes][0] = arrayCoords[i][0]
            coordConservedNodes[indexNodes][1] = arrayCoords[i][1]
          }
        }

        console.log(coordConservedNodes);

        for(i=0; i < coordConservedNodes.length ;i++){
          for(j=0; j < coordConservedNodes.length ;j++){
            if(j == order[i]){
              pointsWay.push(L.latLng(coordConservedNodes[j][0], coordConservedNodes[j][1]))
            }
          }
        }


        console.log(pointsWay)

        var routeControl = L.Routing.control({
          waypoints: pointsWay,

          router: new L.Routing.mapbox('pk.eyJ1IjoiYWRlam9uZ2hlIiwiYSI6ImNrMzl3eTFmeDAydTYzY21nZ3RoY3MwdTEifQ.vnvS6h87mJWeRuwjiWglrg', options),

          routeWhileDragging: true
        }).addTo(mymap);
      });




    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
