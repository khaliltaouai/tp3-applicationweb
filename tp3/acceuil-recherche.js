document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchLivreAccueil");
  const button = document.getElementById("btnRechercheLivreAccueil");
  const resultat = document.getElementById("resultatLivreAccueil");

  button.addEventListener("click", async () => {
    const titre = input.value.trim().toLowerCase();

    if (titre === "") {
      resultat.textContent = "❗ Entrez un titre.";
      resultat.style.color = "orange";
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/ords/commande/livres/");
      const data = await res.json();

      const match = data.items.find(livre =>
        livre.titre.toLowerCase().includes(titre)
      );

      if (match) {
        resultat.textContent = `✅ Livre trouvé : "${match.titre}"`;
        resultat.style.color = "green";
      } else {
        resultat.textContent = "❌ Aucun livre trouvé.";
        resultat.style.color = "red";
      }

    } catch (e) {
      console.error("Erreur API :", e);
      resultat.textContent = "❌ Erreur de connexion à l'API.";
      resultat.style.color = "red";
    }
  });
});
