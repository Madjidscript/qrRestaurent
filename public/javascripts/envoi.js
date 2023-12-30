
let data2
let paniero = JSON.parse(localStorage.getItem("Qrcode")) ;
let data =[]
paniero.forEach(element => {
    const textcontent = element
    data.push(textcontent)
    console.log('le nom objet',data);
});

let num = ""
let totaliter = document.querySelector(".totaux").textContent
console.log('ma totaliter hooo',totaliter);
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








let pp = document.querySelector('#panier')

  async function envoyerAuServeur(objet) {
    console.log('object',objet);
    try {
        const response = await fetch(' https://qrrestaux.onrender.com/afficher', {
           // http://localhost:3000/afficher
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objet),
            
        });
        

        
        if (response) {
            console.log('Élément du cmmd ajouté à la base de données.',response);
            const responseData = await response.json();
            console.log('Élément du cmmd ajouté à la base de données.',responseData,responseData.data);
            pp.textContent=responseData.data
            localStorage.removeItem('Qrcode')
            JSON.parse(localStorage.getItem('cmmd'))
            localStorage.setItem('cmmd',JSON.stringify(objet))
            console.log('mamaan');
        } else {
            console.error('Erreur lors de l\'ajout à la base de données.');
        }
    } catch (error) {
        console.log(error);
    }
}

// Utilisez cette fonction lorsque vous êtes prêt à envoyer les données du cmmd


