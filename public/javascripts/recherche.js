function filterNames() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const body = document.querySelectorAll('.hexagon-item');

    body.forEach(item => {
      const name = item.querySelector('.titres').textContent.toLowerCase();
      if (name.includes(query)) {
        item.style.display = '';
      } else {
        item.textContent= " nous avons pas cette recette";
        item.style.color = 'red';
        item.style.fontSize = '30px';
        
      }
    });
  }