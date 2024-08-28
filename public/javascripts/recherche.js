document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const resultsContainer = document.querySelector('.hexagon-menu');
  const id = document.getElementById('pageId').dataset.id;

  // Fonction pour gérer l'incrémentation du panier
  const handleIncrement = (event) => {
    const element = event.target.closest('.hexagon-item');
    if (element) {
      const images = element.querySelector('.img').getAttribute('href');
      let prix = parseInt(element.querySelector('.prix').textContent.replace(/\D/g, ''));
      let id = element.querySelector('.id').textContent;

      let panier = JSON.parse(localStorage.getItem('Qrcode')) || [];
      let data = {
        id: id,
        image: images,
        nom: element.querySelector('.titres').textContent,
        prix: prix,
        prixIni: prix,
        nbre: 1,
      };

      const existingItem = panier.find(item => item.id === data.id);
      if (existingItem) {
        existingItem.nbre += 1;
        existingItem.prix = existingItem.nbre * data.prix;
      } else {
        panier.push(data);
      }

      localStorage.setItem('Qrcode', JSON.stringify(panier));
      updateCartCount();
    }
  };

  // Met à jour le compteur du panier
  const updateCartCount = () => {
    const panier = JSON.parse(localStorage.getItem('Qrcode')) || [];
    const totalItems = panier.reduce((sum, item) => sum + item.nbre, 0);
    document.querySelector('.cart-container .nbre').textContent = totalItems;
  };

  // Événement de recherche
  searchInput.addEventListener('input', async () => {
    const searchQuery = searchInput.value;
    if (searchQuery.length === 0) {
      resultsContainer.innerHTML = ''; // Effacer les résultats si la recherche est vide
      return;
    }

    try {
      const response = await fetch(`/search/${id}?search=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Réponse réseau non ok');
      }
      const data = await response.json();
      const { recups } = data;
      resultsContainer.innerHTML = ''; // Effacer les anciens résultats

      recups.forEach(element => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('hexagon-item');
        resultDiv.innerHTML = `
          <a class="hex-content" style="overflow: hidden;padding: 10px;">
            <span class="hex-content-inner">
              <span class="title" style="font-size: 20px;"><strong class="titres">${element.nom}</strong></span>
            </span>
            <svg viewBox="0 0 173.20508075688772 200" height="auto" width="auto" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <image class="img" href="/${element.image.replace(/\\/g, '/')}" height="100%" width="100%" />
            </svg>
            <div class="id">${element.id}</div>
          </a>
          <span class="prix"><strong><i class="fas fa-tag"></i>${element.prix} Cfa</strong></span>
        `;
        resultsContainer.appendChild(resultDiv);
      });

      // Réaffecter l'événement après ajout du contenu
      resultsContainer.querySelectorAll('.hex-content').forEach(element => {
        element.addEventListener('click', handleIncrement);
      });

      updateCartCount(); // Met à jour le compteur du panier

    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  });

  // Initialiser le compteur du panier au chargement
  updateCartCount();
});
