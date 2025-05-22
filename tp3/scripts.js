function scrollBooks(direction) {
  const slider = document.querySelector('.slider-container');
  const step = 250 + 100; 
  slider.scrollBy({ left: direction * step, behavior: 'smooth' });
}



document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const card   = btn.closest('.book');
    const title  = card.querySelector('strong').innerText;
    const author = card.querySelector('p').innerText.split('\n')[1];
    const img    = card.querySelector('img').src;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    cart.push({ title, author, img });

    localStorage.setItem('cart', JSON.stringify(cart));

    let countSpan = document.getElementById('cartCount');
    if (countSpan) {
      countSpan.textContent = cart.length;
    }

    btn.textContent = '✔️ Ajouté';
    setTimeout(() => btn.textContent = '🛒 Ajouter', 1000);
  });
});
