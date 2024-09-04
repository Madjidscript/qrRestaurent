// Déclaration de la variable socket
const socket = io("https://qrrestaux.onrender.com");
//http://localhost:7000
// https://qrrestaux.onrender.com
socket.on("connect",()=>{
    console.log("socketr connecter")
    document.getElementById('confirmCancel').addEventListener('click', () => {
        const num = window.location.search.replace(/^\?numtable=/, '');
        socket.emit('annulerCoande', num);
    });
})

// Gestion du bouton de validation de commande

