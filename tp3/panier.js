document.addEventListener('DOMContentLoaded', () => {
  const cartContainer       = document.getElementById('cartItems');
  const daInput             = document.getElementById('daNumber');
  const daSubmit            = document.getElementById('daSubmit');
  const returnDateSpan      = document.getElementById('returnDate');
  const finalizeBtn         = document.getElementById('finalize');
  const penalitesContainer  = document.getElementById('penalitesContainer');

  renderCart();

  
  daSubmit.addEventListener('click', async () => {
    const da = daInput.value.trim();
    if (!da) {
      alert("Veuillez entrer un numéro de DA.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/ords/commande/membres/?q={"numero_da":${da}}`);
      const result = await response.json();

      if (!result.items || result.items.length === 0) {
        alert("Membre introuvable.");
        return;
      }

      const membre = result.items[0];
      alert(`Bienvenue ${membre.nom} ${membre.prenom}`);
      afficherPenalites(da);

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la vérification du membre.");
    }
  });

  
  finalizeBtn.addEventListener('click', async () => {
    const da = daInput.value.trim();
    const date = returnDateSpan.textContent;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (!da || cart.length === 0) {
      alert("DA ou panier vide.");
      return;
    }

    for (const item of cart) {
      const body = {
        membre_numero_da: da,
        livre_id_livre: item.id,
        date_retour_prevue: date
      };

      try {
        await fetch("http://localhost:8080/ords/commande/emprunts/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
      } catch (e) {
        console.error("Erreur d'emprunt:", e);
      }
    }

    alert("Panier finalisé !");
    localStorage.removeItem("cart");
    location.reload();
  });

  
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.img}" alt="${item.title}" />
        <div class="item-info">
          <h2>${item.title}</h2>
          <p>${item.author}</p>
        </div>
      `;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-item'; 
      removeBtn.textContent = 'Supprimer';
      removeBtn.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });

      div.appendChild(removeBtn);
      cartContainer.appendChild(div);
    });
  }

  async function afficherPenalites(da) {
    try {
      const res = await fetch(`http://localhost:8080/ords/commande/penalites/`);
      const data = await res.json();

      const penalites = data.items.filter(p => p.emprunt_id_emprunt && String(p.emprunt_id_emprunt).startsWith(da));
      penalitesContainer.innerHTML = "";

      if (penalites.length === 0) {
        penalitesContainer.innerHTML = "<p>Aucune pénalité.</p>";
      } else {
        penalites.forEach(p => {
          penalitesContainer.innerHTML += `<p>💸 ${p.montant} $ - ${p.raison}</p>`;
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
});
