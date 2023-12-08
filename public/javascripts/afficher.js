let html = ''
let parent = document.querySelector('#panier')
console.log('qsdfghjklmù',parent);
let panier = JSON.parse(localStorage.getItem("Qrcode"))
console.log("mon ami ",panier);

panier.forEach(element => {
    console.log('mon ppppp',element);
 html+=` <div class="article">
 <div class="image">
     <img src="${element.image}" alt="Image de l'article">
 </div>
 <div class="details">
     <div class="nom">${element.nom}</div>
     <div class="prix">Prix : ${element.prix}</div>
     <div class="quantite">
         <button class="btn" >-</button>
         <span id="quantite">${element.nbre}</span>
         <button class="btn">+</button>
     </div>
     <button class="btn supprimer">Supprimer</button>
 </div>
 </div>
 <!-- Ajoutez plus d'articles ici -->
 </div>
 `
});
parent.innerHTML=html
