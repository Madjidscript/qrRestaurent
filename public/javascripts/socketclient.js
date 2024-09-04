// Déclaration de la variable socket
const socket = io("https://qrrestaux.onrender.com");

socket.on("connect",()=>{
    console.log("socketr connecter")
    document.getElementById('commande').addEventListener('click', () => {
        const num = window.location.search.replace(/^\?numtable=/, '');
        socket.emit('commandeValidee', num);
    });
})

// Gestion du bouton de validation de commande

