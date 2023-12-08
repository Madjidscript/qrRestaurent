const parents = document.querySelectorAll('.hex-content')

console.log('le parent',parents);


parents.forEach(element => {
  console.log('element,',element.innerText);
  element.addEventListener('click',()=>{
    console.log("papa");
    const images =element.children[1].childNodes[0].href.animVal
    let prix =parseInt(element.nextElementSibling.innerText)
      
    
    console.log('mon petit imaage',images,prix,typeof(prix));
    let panier = localStorage.getItem("Qrcode")
   
    let data = {
      id:1,
      image:images,
      nom:element.innerText,
      prix:prix,
      nbre:1
    }
    console.log("le vrai",data.nom);

    if (panier===null) {
      panier=[]
      panier.push(data)
      localStorage.setItem("Qrcode",JSON.stringify(panier))
    }else{
    console.log("le faux",panier);
    
const paniers = JSON.parse(panier)
const maxId = Math.max(...paniers.map(item => item.id));
data.id = maxId + 1;
console.log("le fauttttt",typeof(paniers),Array.from(paniers)[0] );
      if (panier.includes(data.nom)) {
        const papa = Array.from(paniers).find(element => {
          console.log("ma verification unique",element.nom) 
          console.log("ma verification unique",data.nom,data.id,typeof(data.id)) 
           return element.nom === data.nom
        });
    
        papa.nbre= papa.nbre+data.nbre
        papa.prix= papa.nbre*data.prix
        data = {
          id:1,
          image:images,
          nom:element.innerText,
          prix:papa.prix,
          nbre:papa.nbre
        }
        console.log("mon nonbre", papa.nbre,typeof(papa.nbre));
        console.log('le vrai chao',papa);
        
        localStorage.setItem("Qrcode",JSON.stringify(paniers))
      } else {
        panier =JSON.parse(panier)
       
        panier.push(data)
        localStorage.setItem("Qrcode",JSON.stringify(panier))
      }
     
    
    }
  })
  let supprimer = document.querySelectorAll('.supprimer')
  console.log("ma suppresion deplacer",supprimer);
});
