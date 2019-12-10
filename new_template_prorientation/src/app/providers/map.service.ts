import { Injectable } from '@angular/core';
import 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import 'leaflet-routing-machine';
declare let L;
import { mapbox } from 'lrm-mapbox';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public testMap;

  constructor() {
  }

  zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : this.zeros(dimensions.slice(1)));
    }

    return array;
  }

  getDistance(routeControl){
    return new Promise( (resolve,reject) => {

      routeControl.addEventListener('routesfound', function(e) {
  
        var routes = e.routes;
        var summary = routes[0].summary;
        var dist = summary.totalDistance;

        if(dist >= 0){
          //console.log("get distance sucess");
          resolve(dist);
        }else{
          console.log("get distance failed");
          reject("erreur");
        }
      })
    });
  }

  public getRouteControl = (w,x,y,z) => {
    return new Promise( (resolve,reject) => {
      let options = { profile: 'mapbox/walking' };
      
      var routeControl = L.Routing.control({
        waypoints: [
          L.latLng(w, x),
          L.latLng(y, z)
        ],
        router: new L.Routing.mapbox('pk.eyJ1IjoibHVjYXNib3V2YXJlbCIsImEiOiJjazJycHIwbXQwZGs3M25udmltaGg3eTFlIn0.XGIAxbBH8QGE1ZnmHUztMQ', options),
        routeWhileDragging: true

      }).addTo(this.testMap);

      

      if(routeControl === undefined){
        console.log("routing failed");
        reject("erreur");
      }else{
        //console.log("routing sucess");
        resolve(routeControl);
      }
    });
  }

  public computeEuclideanDistance = (w,x,y,z) => {
    return new Promise(async (resolve,reject) => {

      var dist = Math.sqrt(Math.pow(w - x,2)+ Math.pow(y - z,2));
      if(dist === 0){
        reject("erreur");
      }else{
        resolve(dist);
      }
    });
  }

  public checkDistances = (x,y,array) => {
    return new Promise(async (resolve,reject) => {
      var boolean = 0;
      for(var j=1;j<array.length;j++){

        await this.computeEuclideanDistance(x,array[j][0],y,array[j][1]).then((dist)=>{

          if(dist <0.01){
            boolean = 1
          }
        });
      }
      if(boolean === undefined){
        reject("erreur");
      }else{
        resolve(boolean);
      }
    });
  }
  
  public getArrayCoords = (lat,long) => {
    return new Promise(async (resolve,reject) => {
      var arrayCoords = new Array();

      var marge = 0.02;

      var latM = lat-marge
      var latP = lat+marge
      var longM = long-marge
      var longP = long+marge

      var urlInterest = 'https://www.overpass-api.de/api/interpreter?data=[out:json];node[tourism]('+ latM + ',' + longM + ',' + latP + ',' + longP + ');out%20meta;';

      console.log(urlInterest);
      var reqInterest = new XMLHttpRequest();
      reqInterest.responseType = "json";
      reqInterest.open('GET', urlInterest, true);
      reqInterest.send();

      reqInterest.addEventListener('readystatechange', () => {
        if(reqInterest.readyState === XMLHttpRequest.DONE) {
          reqInterest.onload = async  () => {
            var elem = reqInterest.response.elements;

            for(var i=0;i<elem.length;i++){
              arrayCoords[i] = new Array();
              arrayCoords[i][0]=elem[i].lat;
              arrayCoords[i][1]=elem[i].lon;
            }

            var arrayCoords1 = new Array();
            arrayCoords1[0] = new Array();
            arrayCoords1[0][0]=lat;
            arrayCoords1[0][1]=long;

            var ind = 1
            var sizeArrayCoords = 0
            for(var i=1;i<elem.length;i++){

              await this.checkDistances(arrayCoords[i][0], arrayCoords[i][1], arrayCoords1).then((boolean)=>{
                if(boolean === 0){
                  arrayCoords1[ind] = new Array();
                  arrayCoords1[ind][0]= arrayCoords[i][0];
                  arrayCoords1[ind][1]= arrayCoords[i][1];
                  ind = ind +1;
                }
              });
            }
            console.log("array coords : ",arrayCoords1)
            if(arrayCoords1 === undefined){
              reject("erreur");
            }else{
              resolve([arrayCoords1,arrayCoords1.length]);
            }
          }
        }
      });
    });
  }

  getConnection() {
    return new Promise(async function (resolve, reject) {

      var url = 'http://127.0.0.1:8080/'
      var reqConnection = new XMLHttpRequest();

      var formData = new FormData();
      var connection_port;

      var message = 'connection request';
      formData.append('msg',message.toString());

      reqConnection.responseType = "json";
      reqConnection.open('POST',url,true);
      reqConnection.send(formData);

      reqConnection.addEventListener('readystatechange', function () {

        if(reqConnection.readyState == XMLHttpRequest.DONE) {
          reqConnection.onload = function () {
            connection_port = reqConnection.response;
            console.log('connection port received : ',connection_port)

            if(connection_port == undefined) {
              reject("connexion failed, le serveur n'a pas répondu");
            }else {
              resolve(connection_port);
            }

          }
        }

      });
    });
  }

  public getDistanceMatrix = (arrayCoords) => {
    return new Promise(async (resolve,reject) => {

      var i;
      var j;
      var arrayDistances = [];

      for (i = 0; i < arrayCoords.length; i++) {
        for (j = 0; j < arrayCoords.length; j++) {
          var routeControl = await this.getRouteControl(arrayCoords[i][0], arrayCoords[i][1], arrayCoords[j][0], arrayCoords[j][1]);
          await this.getDistance(routeControl).then((res)=>{
            arrayDistances.push(res);
          });
        }
      }
      if(arrayDistances === undefined){
        //console.log("distance matrix failed");
        reject("erreur");
      }else{
        //console.log("distance matrix sucess");
        resolve(arrayDistances);
      }
    });
  }

  public tsp = (lat,long) => {
    var target = 6000;
    return new Promise(async (resolve,reject) => {
      var getArray = await this.getArrayCoords(lat,long).then(async (resArrayCoords) => {
        var arrayLength = resArrayCoords[1];
        var arrayCoords = resArrayCoords[0];
        var getDistance = await this.getDistanceMatrix(arrayCoords).then((res)=>{
          console.log("error is here");
          var length = arrayLength;
          var distances = this.zeros([arrayLength, arrayLength]);
          var k;
          var l;
          var index = 0;

          for (k = 0; k < arrayLength; k++) {
            for (l = 0; l < arrayLength; l++) {
              distances[k][l] = res[index];
              index = index +1;
            }
          }

          console.log("get ready to start tsp");
          console.log(distances);

          var urlDistances = 'http://127.0.0.1:8080/';
          var formData = new FormData();
          formData.append('dist', distances.toString());
          formData.append('distTarget', target.toString());
          var reqDistances = new XMLHttpRequest();
          reqDistances.responseType = "json";
          reqDistances.open('POST', urlDistances, true);
          reqDistances.send(formData);

          reqDistances.addEventListener('readystatechange', function() {
            if(reqDistances.readyState === XMLHttpRequest.DONE) {
              console.log("distances get ok")
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
                  resolve([intDistances,intEliminated,arrayCoords]);
                }
              }
            }
         });
        });
      });
    });
  }
}