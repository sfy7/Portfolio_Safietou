let projets = [];
const API_URL = "http://localhost:3000/projets";

// ============================================================
// CHARGER LES PROJETS — GET
// ============================================================
async function chargerProjets() {
  try {
    const response = await fetch(API_URL);
    projets = await response.json();
    projets.forEach(p => {
      creerProjet(p.id, p.libelle, p.image);
    });
  } catch (error) {
    console.error("Erreur chargement projets :", error);
  }
}

// Lancement au démarrage
chargerProjets();