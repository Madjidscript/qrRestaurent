//display flyout mobile-menu



  document.addEventListener("DOMContentLoaded",()=>{
    const currentPath = window.location.pathname;
    const navlinks = document.querySelectorAll(".nav-links")

    navlinks.forEach(link => {
        if (link.getAttribute("href")===(currentPath)) {
            console.log("pppppppppp")
            link.classList.add("active");
            
        }
        
    });
  })
