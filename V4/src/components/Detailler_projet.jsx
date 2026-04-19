// Detailler_projet.jsx — Composant de détail d'un projet
//
// Affiche les informations complètes d'un projet sélectionné
// dans un panneau (drawer) latéral qui glisse depuis la droite.
//
// Props :
//   - projet (obj)    : les données du projet à afficher
//   - onAnnuler (fn)  : appelée quand on clique "Fermer"
//   - onEditer (fn)   : appelée quand on clique "Éditer"

import React from 'react'

// Animation CSS injectée dynamiquement (Tailwind ne gère pas les keyframes custom)
const slideInStyle = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);   opacity: 1; }
  }
  .panel-slide-in {
    animation: slideIn 0.3s ease;
  }
`

function DetaillerProjet({ projet, onAnnuler, onEditer }) {
  // Si aucun projet n'est sélectionné, on n'affiche rien
  if (!projet) return null

  // Divise la chaîne de technologies en tableau
  // Ex: "React, Node.js, MySQL" → ["React", "Node.js", "MySQL"]
  const techArray = projet.technologies.split(',').map(t => t.trim())

  return (
    // Overlay : fond semi-transparent qui couvre toute la page
    // Clic sur l'overlay = fermer le panneau
    <div className="fixed inset-0 bg-black/70 z-200 flex justify-center items-center backdrop-blur-sm"
      onClick={onAnnuler}
    >
      {/* Injection de l'animation keyframe dans le <head> */}
      <style>{slideInStyle}</style>

      {/* Panneau centré
          stopPropagation empêche le clic de remonter à l'overlay */}
      <div className="panel-slide-in w-full max-w-130 bg-[#0d0d14] shadow-2xl border border-[#1e1e2e] rounded-2xl"
        onClick={e => e.stopPropagation()}
      >

        {/* Image du projet */}
        {projet.image ? (
          <img
            src={projet.image}
            alt={projet.libelle}
            className="w-full h-55 object-cover rounded-t-2xl"/>
        ) : (
          /* Image de remplacement */
          <div className="w-full h-55 flex items-center justify-center text-6xl bg-linear-to-br from-[#1a1a2e] to-[#2d1b69] rounded-t-2xl">
            🖥️
          </div>
        )}

        {/* Corps du panneau */}
        <div className="p-6"> {/* padding interne réduit pour optimiser l'espace */}

          {/* Titre du projet */}
          <h3 className="font-syne text-[1.6rem] font-extrabold text-violet-400 mb-1">
            {projet.libelle}
          </h3>

          {/* Date */}
          <p className="text-[#8b8aa0] text-sm mb-6"> {/* gris, petit, marge basse */}
            {projet.date}
          </p>

          {/* Label "Description" */}
          <p className="font-syne text-base font-bold text-[#f1f0f8] mt-5 mb-2">
            Description
          </p>

          {/* Texte de description */}
          <p className="text-[#c5c4d8] text-[0.95rem] leading-7">
            {projet.description}
          </p>

          {/* Label "Technologies" */}
          <p className="font-syne text-base font-bold text-[#f1f0f8] mt-5 mb-2">
            Technologies utilisées
          </p>

          {/* Liste des badges de technologies */}
          <div className="flex flex-wrap gap-2 mt-2"> {/* flex avec retour à la ligne, espacés */}
            {techArray.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-violet-950/20 border border-violet-700/35 rounded-full text-violet-400 text-[0.82rem] font-semibold">
                {tech}
              </span>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 mt-8 pt-5 border-t border-[#1e1e2e]">
            {/* Bouton "Fermer" — style neutre/gris */}
            <button type="button" className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-[#1e1e2e] text-[#8b8aa0] border border-[#2a2a3e] hover:bg-[#2a2a3e] transition-colors"
              onClick={onAnnuler}
            >
              ✕ Annuler
            </button>

            {/* Bouton "Éditer" — style primaire/violet */}
            <button type="button" className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              onClick={() => onEditer(projet)}
            >
              ✏️ Éditer
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DetaillerProjet
