
let data2
let totaliter = document.querySelector(".totaux").textContent
let nom = document.querySelectorAll('.nom')
let paniero = JSON.parse(localStorage.getItem("Qrcode")) || [];
let data =[]
paniero.forEach(element => {
    const textcontent = element
    data.push(textcontent)
    console.log('le nom vraivreied ',data);
});
console.log('ma totaliter hooo',totaliter);
console.log('ma nom hooo',nom);
let num = ""

let commande = document.querySelector(".commande")

console.log('ma comande',commande);
commande.addEventListener('click',(e) =>{
    e.preventDefault()
 num =document.querySelector('.num').value
 
 
    console.log("mon numerosss",num)
    const cmmd = {
        num:num,
        total:totaliter,
        data:data,
      }
      data2=cmmd
      envoyerAuServeur(data2)
      console.log("mon objet fiable",cmmd);
})










  async function envoyerAuServeur(objet) {
    console.log('object',objet);
    try {
        const response = await fetch('http://localhost:2000/afficher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objet),
            
        });
        
        if (response.ok) {
            console.log('Élément du cmmd ajouté à la base de données.',response.ok);
          //localStorage.removeItem('Qrcode')
        } else {
            console.error('Erreur lors de l\'ajout à la base de données.');
        }
    } catch (error) {
        console.error(error);
    }
}

// Utilisez cette fonction lorsque vous êtes prêt à envoyer les données du cmmd


