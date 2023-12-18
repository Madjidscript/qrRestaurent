let bouton = document.querySelectorAll(".servit")
bouton.forEach(element => {
    element.addEventListener("click",()=>{
        window.location.reload()
    })
});