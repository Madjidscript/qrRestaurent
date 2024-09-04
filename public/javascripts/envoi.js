document.addEventListener('DOMContentLoaded', () => {
    let data2;
    let paniero = JSON.parse(localStorage.getItem("Qrcode"));
    let alerge = JSON.parse(localStorage.getItem("alergit"));
    let data = [];
    let data3 = [];
    let idCommande; // Remplacez par l'ID dynamique si nécessaire
    let deleteUrl;
    let redirectTimeout;
    let alergit 
  
    let msg = document.getElementById('msg');
    console.log("eeeeee",msg);
    

    document.getElementById('submitButton').addEventListener('click', function() {
        // Récupère les valeurs des champs du formulaire
        const alergieValue = document.getElementById('alergieInput').value;
        const temperatureValue = document.getElementById('temperatureSelect').value;
        
    
        // Crée l'objet alergit avec les valeurs récupérées
         alergit = {
          alergit: alergieValue,
          temperature: temperatureValue
        };
        let alergitArray = JSON.parse(localStorage.getItem('alergit')) || [];
        // Ajoute l'objet alergit au tableau
        alergitArray.push(alergit);
        // Sauvegarde le tableau mis à jour dans localStorage
        localStorage.setItem('alergit', JSON.stringify(alergitArray));
        console.log('Alergit ajouté au localStorage :', alergitArray);
        
        
        
        // Affiche ou utilise l'objet alergit
        if (alergieValue ==="") {
            msg.textContent="remplisez vos champs" ;
            console.log("eeeeee",msg);
        }else{
            console.log('Objet alergit :', alergit);
            redirectTimeout = setTimeout(() => {
             window.location.href = `http://localhost:7000/afficher?numtable=${num}`;
            console.log('didier drogba',);
        }, 10000);
    
        }
       
    });

    if (paniero) {
        paniero.forEach(element => {
            data.push(element);
           
            console.log('le nom objet', data,"roro",data3);
        });
    }
    if (alerge) {
        alerge.forEach(element => {
            data3.push(element);
           
            console.log('le nom objet', data,"roro",data3);
        });
    }
    console.log("mon ami des ", data);

    let num = window.location.search.replace(/^\?numtable=/, '');
    console.log('mmmmmmm', num);

    let totaliter = document.querySelector(".totaux").textContent;
    console.log('ma totaliter hooo', totaliter);

    let commande = document.querySelector(".commande");
    let alergie = document.querySelector(".alergie");
    let annule = document.querySelector(".annule");
    let pp = document.querySelector('#panier');

    // Référence à la boîte de dialogue et aux boutons
    let modal = document.getElementById("confirmationModal");
    let closeBtn = document.querySelector(".close");
    let confirmBtn = document.getElementById("confirmCancel");
    let cancelBtn = document.querySelector("#cancelCancel");
   

    function mettreAJourAffichage() {
        if (totaliter === "0" || totaliter === "" || totaliter === 0) {
            pp.innerHTML = `<h3>votre panier est vide cher client</h3>`;
            if (commande) commande.style.display = 'none';
            if (alergie) alergie.style.display = 'none';
            if (annule) annule.style.display = 'none';
        } else {
            if (commande) commande.style.display = 'inline';
            if (alergie) alergie.style.display = 'inline';
            if (annule) annule.style.display = 'none';
        }
    }

    mettreAJourAffichage();
    

    if (commande) {
        commande.addEventListener('click', async (e) => {
            e.preventDefault();

            console.log("mon numerosss", num);
            const cmmd = {
                num: num,
                total: totaliter,
                data: data,
                alergit:data3
                
            };
            data2 = cmmd;
            console.log("mon objet fiable", cmmd);

            try {
                const response = await fetch(`http://localhost:7000/afficher?numtable=${num}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cmmd),
                });

                if (response.ok) {
                    console.log('Élément du cmmd ajouté à la base de données.', response);
                    const responseData = await response.json();
                    console.log('Élément du cmmd ajouté à la base de données.', responseData, responseData.data);

                    pp.textContent = responseData.data;
                    idCommande = responseData.data2[0]._id;
                    console.log("le fameux id rechercher", idCommande);
                    deleteUrl = `http://localhost:7000/admin/annulecommande/${idCommande}?numtable=${num}`;

                    localStorage.removeItem('Qrcode');
                    localStorage.setItem('cmmd', JSON.stringify(cmmd));
                    console.log('mamaan');

                    if (commande) commande.style.display = 'none';
                    if (annule) annule.style.display = 'block'; 

                    // Démarrer le délai de redirection
                    redirectTimeout = setTimeout(() => {
                        window.location.href = `http://localhost:7000/acceuil?numtable=${num}`;
                        console.log('didier drogba');
                    }, 1000); // 3 minutes en millisecondes

                } else {
                    console.error('Erreur lors de l\'ajout à la base de données.');
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    // Afficher la boîte de dialogue de confirmation lorsque le bouton d'annulation est cliqué
    if (annule) {
        annule.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = "block"; // Affiche la boîte de dialogue
        });
    }

    // Fermer la boîte de dialogue lorsque l'utilisateur clique sur la croix
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none"; // Cache la boîte de dialogue
        });
    }

    // Annuler la commande après confirmation
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    console.log('Commande annulée avec succès hooooo.');
                    pp.innerHTML = `<h3>votre panier est vide cher client</h3>`;
                    if (commande) commande.style.display = 'none';
                    if (alergie) alergie.style.display = 'none';
                    if (annule) annule.style.display = 'none';
                    localStorage.removeItem('cmmd'); // Nettoie localStorage après annulation

                    // Annuler le délai de redirection et rediriger immédiatement
                    clearTimeout(redirectTimeout);
                    window.location.href = `http://localhost:7000/acceuil?numtable=${num}`;
                } else {
                    console.error('Erreur lors de l\'annulation de la commande.');
                }
            } catch (error) {
                console.log(error);
            }

            modal.style.display = "none"; // Cache le modal après annulation
        });
    }

    // Fermer la boîte de dialogue lorsque l'utilisateur clique en dehors de celle-ci
    window.addEventListener('click', (event) => {  
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Annuler l'annulation si l'utilisateur clique sur le bouton "Non"
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = "none"; // Cache le modal sans annuler
        });
    }
});


const overlay = document.querySelector(".overlay")
console.log("mon poutoutou de overlay",overlay)


