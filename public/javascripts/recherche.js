function filterNames() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const body = document.querySelectorAll('.hexagon-item');
    const box = document.querySelector('.hexagon-menu');


    body.forEach(item => {
      const name = item.querySelector('.titres').textContent.toLowerCase();
      if (name.includes(query)) {
        item.style.display = '';
      } else {
        item.textContent= " ";
        item.style.color = 'red';
        item.style.fontSize = '30px';
        
      }
    });
  }