let bouton = document.querySelectorAll(".servit")
bouton.forEach(element => {
    console.log('mon madjid');
    element.addEventListener("click",()=>{
        window.location.reload()
    })
    console.log('ma doriane');
});