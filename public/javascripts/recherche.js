function filterNames() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const body = document.querySelectorAll('.hexagon-box');
    const box = document.querySelector('.hexagon-item');


    body.forEach(item => {
      const name = item.querySelector('.titres').textContent.toLowerCase();
      if (name.includes(query)) {
        item.style.display = '';
      } else {
        box.textContent= "pat introuvée";
        box.style.color = 'red';
        box.style.fontSize = '25px';
        
      }
    });
  }