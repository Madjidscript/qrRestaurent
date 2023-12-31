let bouton = document.querySelector(".valider")
let message = document.querySelector(".message")
console.log("yeeee",bouton);
    bouton.addEventListener("click",(e)=>{
       e.preventDefault()
       setTimeout(function() {
        // Actualiser la page
        message.textContent
        window.location.reload();
    }, 3000)
        // window.location.reload()
        console.log('mon  bouton');
    })
