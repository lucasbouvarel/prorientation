var add= (i)=>{

  return new Promise(function(resolve,reject){
    i=i+1;
    if(i==1){
      resolve(i);
    }else{
      console.log("erreur ici");
      reject("erreur");
    }

  })
}
var fonc = () =>{
  return new Promise(function(resolve, reject){
    var i=1;
    add(i)
    .then(i => {

      resolve(i);
    })
    .catch(err => {
      console.log("erreur laaaa");
      reject("erreur")
    })
  })
}

fonc().then(i=>{
  console.log(i);
})
.catch(()=>{
  console.log("error");
})
