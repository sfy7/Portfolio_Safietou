// Dossier.jsx — Composant principal de gestion des projets
// C'est le "cerveau" de la section projets.
// Il est responsable de :
//   - Charger la liste des projets depuis le serveur (json-server)
//   - Afficher la grille des projets (via le composant Projet)
//   - Gérer l'ajout, la suppression et la modification de projets
//   - Afficher le formulaire (AjouterProjet) et le détail (DetaillerProjet)

import React, { useState, useEffect } from 'react'
import Projet from './Projet'
import AjouterProjet from './Ajouter_projet'
import DetaillerProjet from './Detailler_projet'
import { getProjets, ajouterProjet, supprimerProjet, modifierProjet } from '../api'

function Dossier() {
  // --- États du composant ---
  const [projets, setProjets] = useState([])         // Liste complète des projets
  const [chargement, setChargement] = useState(true) // Indicateur de chargement
  const [erreur, setErreur] = useState(null)         // Message d'erreur éventuel
  const [recherche, setRecherche] = useState('')     // Terme de recherche
  const [afficherFormulaire, setAfficherFormulaire] = useState(false) // Montrer/cacher le formulaire
  const [projetDetail, setProjetDetail] = useState(null)   // Projet affiché en détail
  const [projetAEditer, setProjetAEditer] = useState(null) // Projet en cours d'édition
  const [idASupprimer, setIdASupprimer] = useState(null)   // ID du projet à confirmer suppression

  // --- Chargement initial des projets ---
  useEffect(() => {
    const chargerProjets = async () => {
      try {
        setChargement(true)
        const data = await getProjets()
        setProjets(data)
      } catch (err) {
        console.error('Erreur lors du chargement:', err)
        setErreur('Impossible de charger les projets. Assurez-vous que json-server est lancé (npm run server).')
      } finally {
        setChargement(false)
      }
    }
    chargerProjets()
  }, [])

  // Fonction helper pour parser les dates françaises
  const parseFrenchDate = (dateStr) => {
    const cleanDate = dateStr.replace('Ajouté le ', '')
    const months = {
      'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
      'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
    }
    const [day, month, year] = cleanDate.split(' ')
    return new Date(year, months[month.toLowerCase()], day)
  }

  // --- Filtrage et tri des projets selon la recherche ---
  const projetsFiltres = projets
    .filter(p => p.libelle.toLowerCase().includes(recherche.toLowerCase()))
    .sort((a, b) => parseFrenchDate(b.date) - parseFrenchDate(a.date))

  // --- Ajout ou modification d'un projet ---
  const handleAjouter = async (donneesProjet) => {
    try {
      if (projetAEditer) {
        const modifie = await modifierProjet(projetAEditer.id, donneesProjet)
        setProjets(prev => prev.map(p => p.id === projetAEditer.id ? modifie : p))
        setProjetAEditer(null)
      } else {
        const nouveau = await ajouterProjet(donneesProjet)
        setProjets(prev => [nouveau, ...prev])
      }
      setAfficherFormulaire(false)
      document.getElementById('projets')?.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      alert('Erreur lors de la sauvegarde. Vérifiez que json-server est actif.')
    }
  }

  // --- Suppression avec confirmation ---
  const handleDemandeSupprimer = (id) => {
    setIdASupprimer(id)
  }

  const handleConfirmerSupprimer = async () => {
    try {
      await supprimerProjet(idASupprimer)
      setProjets(prev => prev.filter(p => p.id !== idASupprimer))
      setIdASupprimer(null)
      if (projetDetail?.id === idASupprimer) setProjetDetail(null)
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Erreur lors de la suppression.')
    }
  }

  // --- Clic sur "Éditer" depuis le panneau détail ---
  const handleEditer = (projet) => {
    setProjetDetail(null)
    setProjetAEditer(projet)
    setAfficherFormulaire(true)
    setTimeout(() => document.getElementById('ajouter_projet')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  // --- Annuler le formulaire ---
  const handleAnnuler = () => {
    setAfficherFormulaire(false)
    setProjetAEditer(null)
    document.getElementById('projets')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ===================== SECTION PROJETS ===================== */}

      <section id="projets" className="max-w-6xl mx-auto px-6 pt-20 pb-12 scroll-mt-20">

        {/* En-tête de la section */}
        <div className="text-center mb-12">
          <h2 className="font-syne text-5xl font-extrabold text-[#f1f0f8] mb-2">
            Projets{' '}
            <span className="text-violet-600">
              Réalisés
            </span>
          </h2>
          <p className="text-slate-400 text-[1.05rem] max-w-125 mx-auto">
            Voici une sélection de projets que j'ai réalisés en développement FullStack.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="flex justify-center mb-10">
          <input
            className="w-full max-w-100 px-5 py-3 bg-[#111118] border border-[#1e1e2e] rounded-full text-[#f1f0f8] text-[0.95rem] outline-none focus:border-violet-600 transition-colors"
            type="text"
            placeholder="🔍  Rechercher un projet..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
          />
        </div>

        {/* Affichage conditionnel selon l'état */}
        {chargement ? (
            <p className="text-center py-12 text-slate-400">
            ⏳ Chargement des projets...
          </p>
        ) : erreur ? (
          <p className="text-center py-12 text-rose-500">
            ⚠️ {erreur}
          </p>
        ) : (
          <div className="projets-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Cartes des projets filtrés */}
            {projetsFiltres.map(projet => (
              <Projet
                key={projet.id}
                projet={projet}
                onSupprimer={handleDemandeSupprimer}
                onVoirDetail={setProjetDetail}
              />
            ))}

            {/* Message si aucun résultat */}
            {projetsFiltres.length === 0 && projets.length > 0 && (
              <p className="text-center py-12 text-slate-400">
                Aucun projet ne correspond à "{recherche}"
              </p>
            )}

            {/* Carte "Ajouter un projet" — à la fin */}
            <div
              className="bg-[#111118] border-2 border-dashed border-[#2a2a3e] rounded-2xl h-70 flex flex-col items-center justify-center cursor-pointer gap-3 hover:border-violet-600 hover:bg-violet-950/10 transition-colors"
              onClick={() => {
                setProjetAEditer(null)
                setAfficherFormulaire(true)
                setTimeout(() => document.getElementById('ajouter_projet')?.scrollIntoView({ behavior: 'smooth' }), 100)
              }}
            >
             
              <div className="w-14 h-14 rounded-full bg-violet-950/25 border border-violet-700/40 flex items-center justify-center text-3xl text-violet-400">
                +
              </div>

              <p className="text-slate-400 text-sm font-medium">
                Ajouter un projet
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ===================== FORMULAIRE (conditionnel) ===================== */}
      {afficherFormulaire && (
        <>
          <div className="w-full border-t border-white/5"></div>
          <AjouterProjet
            onAjouter={handleAjouter}
            onAnnuler={handleAnnuler}
            projetAEditer={projetAEditer}
          />
        </>
      )}

      {/* ===================== PANNEAU DÉTAIL ===================== */}
      <DetaillerProjet
        projet={projetDetail}
        onAnnuler={() => setProjetDetail(null)}
        onEditer={handleEditer}
      />

      {/* ===================== CONFIRMATION SUPPRESSION ===================== */}
      {idASupprimer && (
        <div className="fixed inset-0 bg-black/70 z-300 flex items-center justify-center">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 max-w-90 w-full text-center">

            <p className="font-syne text-xl font-bold text-[#f1f0f8] mb-2">
              ⚠️ Confirmer la suppression
            </p>

            <p className="text-slate-400 text-sm mb-6">
              Cette action est irréversible. Le projet sera définitivement supprimé.
            </p>

            <div className="flex gap-3 justify-center">

              {/* Bouton "Annuler" — style neutre/gris */}
              <button
                type="button"
                className="px-5 py-2 rounded-lg text-sm font-medium bg-[#1e1e2e] text-slate-400 border border-[#2a2a3e] hover:bg-[#2a2a3e] transition-colors"
                onClick={() => setIdASupprimer(null)}
              >
                Annuler
              </button>

              {/* Bouton "Supprimer" — style danger/rouge */}
              <button
                type="button"
                className="px-5 py-2 rounded-lg text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                onClick={handleConfirmerSupprimer}
              >
                Supprimer
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Dossier