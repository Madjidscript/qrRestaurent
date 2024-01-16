document.addEventListener("DOMContentLoaded", function() {
    // Afficher le loader
    showLoader();
  
    // Simuler une opération asynchrone (par exemple, une requête AJAX)
    setTimeout(function() {
      // Cacher le loader après l'opération
      hideLoader();
    }, 2000); // Temps simulé de 3 secondes
  });
  
  function showLoader() {
    document.getElementById("loaderContainer").style.display = "flex";
  }
  
  function hideLoader() {
    document.getElementById("loaderContainer").style.display = "none";
  }