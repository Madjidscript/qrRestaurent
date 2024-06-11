function filterNames() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const body = document.querySelectorAll('.hexagon-item');
    const box = document.querySelector('.hexagon-menu');


    body.forEach(item => {
      const name = item.querySelector('.titres').textContent.toLowerCase();
      if (name.includes(query)) {
        item.style.display = '';
      } else {
       box.textContent= " nous avons pas cette recette";
       box.style.color = 'red';
       box.style.fontSize = '30px';
        
      }
    });
  }