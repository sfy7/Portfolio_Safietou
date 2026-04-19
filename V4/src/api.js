// api.js — Service de communication avec le serveur json-server
// Toutes les requêtes HTTP vers l'API passent par ce fichier
// Cela centralise les appels réseau et facilite la maintenance

// URL de base de notre faux serveur REST (json-server)
// json-server tourne sur le port 3000 et lit le fichier db.json
const BASE_URL = 'http://localhost:3000'

const jsonHeaders = {
  'Content-Type': 'application/json',
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Erreur HTTP ${response.status}`)
  }
  return response.status === 204 ? null : response.json()
}

// -------------------------------------------------------
// GET /projets — Récupère la liste de tous les projets
// -------------------------------------------------------
export const getProjets = async () => {
  const response = await fetch(`${BASE_URL}/projets`)
  return handleResponse(response)
}

// -------------------------------------------------------
// GET /projets/:id — Récupère un seul projet par son ID
// -------------------------------------------------------
export const getProjetById = async (id) => {
  const response = await fetch(`${BASE_URL}/projets/${id}`)
  return handleResponse(response)
}

// -------------------------------------------------------
// POST /projets — Ajoute un nouveau projet
// Paramètre : projetData (objet avec libelle, description, etc.)
// -------------------------------------------------------
export const ajouterProjet = async (projetData) => {
  const response = await fetch(`${BASE_URL}/projets`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(projetData),
  })
  return handleResponse(response)
}

// -------------------------------------------------------
// PUT /projets/:id — Remplace complètement un projet existant
// Paramètre : id (string), projetData (objet complet mis à jour)
// -------------------------------------------------------
export const modifierProjet = async (id, projetData) => {
  const response = await fetch(`${BASE_URL}/projets/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(projetData),
  })
  return handleResponse(response)
}

// -------------------------------------------------------
// DELETE /projets/:id — Supprime un projet par son ID
// -------------------------------------------------------
export const supprimerProjet = async (id) => {
  const response = await fetch(`${BASE_URL}/projets/${id}`, {
    method: 'DELETE',
  })
  await handleResponse(response)
}
