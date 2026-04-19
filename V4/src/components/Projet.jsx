// Projet.jsx — Composant carte d'un projet individuel
//
// Rôle : Afficher le libellé, l'image et un bouton "Supprimer"
//        d'un projet dans la grille.
// Props reçues :
//   - projet (objet)     : les données du projet à afficher
//   - onSupprimer (fn)   : fonction appelée quand on clique "Supprimer"
//   - onVoirDetail (fn)  : fonction appelée quand on clique sur le titre

import React from 'react'

function Projet({ projet, onSupprimer, onVoirDetail }) {
  return (
    <article className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-900/20">
      {/* Image du projet (avec image de remplacement si pas d'URL) */}
      {projet.image ? (
        <img src={projet.image} alt={projet.libelle} className="w-full h-55 object-cover block"
          onError={e => { e.target.style.display = 'none' }}/>
      ) : (
        /* Image de remplacement si pas d'URL */
        <div className="w-full h-55 flex items-center justify-center text-5xl bg-linear-to-br from-[#1a1a2e] to-[#16213e]">
          🖥️
        </div>
      )}

      {/* Corps de la carte */}
      <div className="p-5"> {/* padding interne (1.2rem ≈ p-5) */}

        {/* Titre cliquable → ouvre le détail du projet */}
        <span
          className="font-syne font-bold text-[1.05rem] text-[#f1f0f8] mb-2 cursor-pointer transition-colors duration-200 block hover:text-violet-400"
          onClick={() => onVoirDetail(projet)}
          title="Cliquer pour voir les détails"
        >
          {projet.libelle}
        </span>

        {/* Date d'ajout */}
        <p className="text-xs text-[#8b8aa0] mb-3">
          📅 {projet.date}
        </p>

        {/* Pied de carte : bouton supprimer */}
        <div className="flex justify-end items-center mt-4">
          {/* Bouton Supprimer */}
          <button
            type="button"
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-rose-950/30 text-rose-400 border border-rose-800/40 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors duration-200"
            onClick={e => {
              e.stopPropagation()    // Empêche le clic de remonter à la carte
              onSupprimer(projet.id) // Appelle la fonction de suppression
            }}
          >
            🗑 Supprimer
          </button>
        </div>
      </div>
    </article>
  )
}

export default Projet
