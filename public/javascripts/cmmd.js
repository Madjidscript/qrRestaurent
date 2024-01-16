let bouton = document.querySelectorAll(".servit")
console.log("mon veritable bouton",bouton ,"mon type",typeof(bouton),"ma taille",bouton.length);

bouton.forEach(element => {
    console.log('mon madjid');
    console.log("mon element preferer",element);
    element.addEventListener("click",()=>{
        console.log("mon element preferer",element);
        console.log('mon madjid');
       window.location.reload()
         console.log('ma doriane');
    })
    
});