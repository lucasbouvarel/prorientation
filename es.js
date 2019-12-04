
var request=require('request-promise');
/*var options = {
  uri : "https://www.overpass-api.de/api/interpreter",
  qs : {
    data : "[out:json];node[tourism](43.46669501043081,-5.708215989569187,43.588927989569186,-5.605835010430813);out%20meta;"
  },
  json :true
}*/
var tableau=new Array()
var length=0
request("https://www.overpass-api.de/api/interpreter?data=[out:json];node[tourism](43.46669501043081,-5.708215989569187,43.588927989569186,-5.605835010430813);out%20meta;")
.then(response => {
  data=JSON.parse(response)
  //console.log(data.elements)
  for(var i=0;i<data.elements.length;i++){

    if(data.elements[i].tags.tourism!="hotel"){
      length++

    }else{
      console.log("!!!!!!!!!!!!cest un hotel je n'ajoute pas")
    }
  }
  for (var i=0; i<length;i++){
    tableau[i] = new Array()
    tableau[i][0]=data.elements[i].lat
    tableau[i][1]=data.elements[i].lon
  }
  console.log(tableau)
})
.catch(error => {
  console.log(error)
});
