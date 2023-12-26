let bouton = document.querySelector(".valider")
console.log("yeeee",bouton);
    bouton.addEventListener("click",(e)=>{
       e.preventDefault()
        window.location.reload()
        console.log('mon  bouton');
    })
