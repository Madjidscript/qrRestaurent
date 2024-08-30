const parents = document.querySelectorAll(".hex-content");

console.log("le parent", parents);

parents.forEach((element) => {
  console.log("element,", element.innerText);
  //const images =element.children[1].childNodes[0]

  element.addEventListener("click", () => {
    console.log("papa");

    const images = element.children[1].childNodes[0].href.animVal;
   
    let prix = parseInt(element.nextElementSibling.innerText);
    let id = element.children[2].innerText;
    console.log("mon veritable id", id);
    console.log("mon petit imaage", images, prix, typeof prix);

    let panier = JSON.parse(localStorage.getItem("Qrcode"));

    let data = {
      id: id,
      image: images,
      nom: element.children[0].innerText,
      prix: prix,
      prixIni: prix,
      nbre: 1,
     
    };

    console.log("le vraipanier", typeof panier, panier);
    if (panier === null) {
      console.log("nullllllll");

      panier = [];
      console.log("le vraihhhhhhhhhhhhh", data);
      panier.push(data);
      localStorage.setItem("Qrcode", JSON.stringify(panier));
      nonbre()
    } else {
      console.log("okkkkkkk");

      //  const paniers = JSON.parse(panier)
      console.log("le fauttttthhhhhh", panier, typeof panier);
      //  console.log("le fauttttthhhhhh",typeof(paniers),Array.from(paniers)[0]  ,  paniers);
      console.log("ma verification unique", data.id);
      console.log("ma verification unique", panier[0]);

      const papa = panier.find((element) => {
        console.log("ma verification unique", element.id);
        console.log(
          "ma verification unique",
          data.nom,
          data.id,
          typeof data.id
        );
        return element.id === data.id;
      });
      console.log("le vrai chao", papa);

      if (papa) {
        papa.nbre = papa.nbre + data.nbre;
        papa.prix = papa.nbre * data.prix;
        data = {
          id: id,
          image: images,
          nom: element.innerText,
          prix: papa.prix,
          prixIni: data.prix,
          nbre: papa.nbre,
          
        };
        // console.log("mon nonbre", papa.nbre,typeof(papa.nbre));
        console.log("le vrai chao", data);

        localStorage.setItem("Qrcode", JSON.stringify(panier));
        nonbre()
      } else {
    
        panier.push(data);
        localStorage.setItem("Qrcode", JSON.stringify(panier));
        nonbre()
      }
    }
  });
  let supprimer = document.querySelectorAll(".supprimer");
  console.log("ma suppresion deplacer", supprimer);
});




















function nonbre() {
  let totale = [];
  // Récupérer les données actuelles du stockage local
   let elements = JSON.parse(localStorage.getItem("Qrcode")) ;
   if (elements) {
      // Filtrer les éléments pour exclure celui avec l'ID spécifié
  const recherche = elements.forEach((element) => totale.push(element.nbre));
  console.log("monnn totto", totale);
  const somme = totale.reduce((acc, valeur) => acc + valeur, 0);
  console.log("ma sommme de mes nombre", somme);
  const nbre = (document.querySelector(".nbre").textContent = somme);
  console.log("monvnvvvnv", nbre);
  // Mettre à jour le stockage local avec les nouveaux éléments
   localStorage.setItem("Qrcode", JSON.stringify(elements));
  // console.log("mes element filtrer",localStorage.setItem("Qrcode", JSON.stringify(elements)))
  //  window.location.reload();
  // Mettre à jour l'affichage
   }


}

nonbre()

nonbre()


