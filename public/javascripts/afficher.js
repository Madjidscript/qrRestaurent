
let html = ''
let parent = document.querySelector('#panier')
console.log('qsdfghjklmù',parent);
let panier = JSON.parse(localStorage.getItem("Qrcode"))
// console.log("mon ami ",panier);

panier.forEach(element => {
    console.log('mon ppppp',element);
    
 html+=`
  <div class="article">
    <div class="image">
        <img src="${element.image}" alt="Image de l'article">
    </div>
    <div class="details">
        <div class="nom">${element.nom}</div>
        <div class="prix">Prix : <span class="prit" data-id="${element.id}" >${element.prix}</span></div>
        <div class="quantite">
            <button class="btn moins" data-id="${element.id}">-</button>
            <span id="quantite"data-id="${element.id}">${element.nbre}</span>
            <button class="btn plus"data-id="${element.id}" >+</button>
        </div>
        <button class="btn supprimer"data-id="${element.id}" > <i class="fas fa-trash"style="font-size: 20px" ></i></button>
    </div>
  </div>

 `
});

if (html===" ") {
   parent.textContent="votre panier est vide" 
 
} else {
    parent.innerHTML=html;
}

let supprimerButtons = document.querySelectorAll('.supprimer');
supprimerButtons.forEach(button => {
    button.addEventListener('click', () => {
        let id = button.getAttribute('data-id');
        supprimer(id);
        
    });
});
let incres = document.querySelectorAll('.plus');
incres.forEach(button => {
    button.addEventListener('click', () => {
        let id = button.getAttribute('data-id');
        incre(id);
        totaux();
    });
});
let decres = document.querySelectorAll('.moins');
decres.forEach(button => {
    button.addEventListener('click', () => {
        let id = button.getAttribute('data-id');
        decre(id);
        totaux();
    });
});




function supprimer(id) {
    console.log('iddd',id);
    // Récupérer les données actuelles du stockage local
    let elements = JSON.parse(localStorage.getItem("Qrcode")) ;

    // Filtrer les éléments pour exclure celui avec l'ID spécifié
    elements = elements.filter(element => element.id !== id);

    // Mettre à jour le stockage local avec les nouveaux éléments
    localStorage.setItem("Qrcode", JSON.stringify(elements));
    console.log("mes element filtrer",elements)
      window.location.reload();
    // Mettre à jour l'affichage
   
  }
 

function incre(id) {
   console.log('rechercheid',id)

    // Récupérer les données actuelles du stockage local
    let elements = JSON.parse(localStorage.getItem("Qrcode")) || [];

    // Filtrer les éléments pour exclure celui avec l'ID spécifié
   const recherche = elements.find(element => element.id == id);
   console.log('recherche',recherche)
    if(recherche) {
        console.log("mon veritable prix",recherche)
        const nombre =  recherche.nbre +=1
        const quantite = document.querySelector(`#quantite[data-id="${id}"]`)
        quantite.innerText=nombre
        console.log(quantite);
        const prixINI =parseInt(recherche.prixIni) 
        const prixTotale = parseInt(recherche.prix)+prixINI
        recherche.prix = prixTotale
        console.log("mon prix totale",prixTotale);
        document.querySelector(`.prit[data-id="${id}"]`).innerText =prixTotale
    }
    // Mettre à jour le stockage local avec les nouveaux éléments
    localStorage.setItem("Qrcode", JSON.stringify(elements));
    console.log("mes element filtrer",localStorage.setItem("Qrcode", JSON.stringify(elements)))
    //  window.location.reload();
    // Mettre à jour l'affichage
    
  }




function decre(id) {
   console.log('rechercheid',id)

    // Récupérer les données actuelles du stockage local
    let elements = JSON.parse(localStorage.getItem("Qrcode")) || [];

    // Filtrer les éléments pour exclure celui avec l'ID spécifié
   const recherche = elements.find(element => element.id == id);
   console.log('recherche',recherche)
    if(recherche) {
        console.log("mon veritable prix",recherche)
        if (recherche.nbre<=1) {
            console.log("noooooooo")
            const moins = document.querySelector(".moins")
            console.log("monmoinsssss",moins);
            moins.style.color="red"
        } else {
            const nombre =  recherche.nbre -=1
        const quantite = document.querySelector(`#quantite[data-id="${id}"]`)
        quantite.innerText=nombre
        console.log(quantite);
        const prixINI =parseInt(recherche.prixIni) 
        const prixTotale = parseInt(recherche.prix)-prixINI
        recherche.prix = prixTotale
        console.log("mon prix totale",prixTotale);
        document.querySelector(`.prit[data-id="${id}"]`).innerText =prixTotale
        }
        
    }
    // Mettre à jour le stockage local avec les nouveaux éléments
    localStorage.setItem("Qrcode", JSON.stringify(elements));
    console.log("mes element filtrer",localStorage.setItem("Qrcode", JSON.stringify(elements)))
    //  window.location.reload();
    // Mettre à jour l'affichage
    
  }



function totaux() {
   
  let totale = []
    // Récupérer les données actuelles du stockage local
    let elements = JSON.parse(localStorage.getItem("Qrcode")) || [];

    // Filtrer les éléments pour exclure celui avec l'ID spécifié
   const recherche = elements.forEach(element =>  totale.push(element.prix) );
   console.log("monnn totto",totale)
   const sommes = totale.reduce((acc, valeur) => acc + valeur, 0);
   console.log("ma sommme",sommes);
   
   const yo= document.querySelector('.totaux').textContent=sommes
console.log('monn tttkkknt',yo);
    // Mettre à jour le stockage local avec les nouveaux éléments
    localStorage.setItem("Qrcode", JSON.stringify(elements));
   // console.log("mes element filtrer",localStorage.setItem("Qrcode", JSON.stringify(elements)))
    //  window.location.reload();
    // Mettre à jour l'affichage
    
  }
 totaux()
  



  
 

  
  
