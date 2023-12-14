let bouton = document.querySelectorAll(".servit")
let plat = document.querySelectorAll(".plat")
let num = document.querySelector(".num")
let total = document.querySelector(".total")
console.log("mon bouton hooo",bouton,plat,num,total);
bouton.forEach(element => {
    element.addEventListener("click",(e)=>{
        plat.style.display="none"
        num.style.display="none"
        total.style.display="none"
        bouton.style.display="none"
    
});
})