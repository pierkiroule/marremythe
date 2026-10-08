# MARREMYTHE •°

À partir d’un « j’en ai marre », découvrir un mythe, une légende ou un conte qui fait écho à ce qui pèse, à ce que l’on ressent et à la ressource recherchée. Application React 19 et Vite 7, responsive, sans compte ni backend.

## Développement

Node.js ≥ 22.12 (Node 24 recommandé).

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Le build `dist/` peut être déployé sur un hébergement statique, y compris en sous-répertoire.

## Parcours

Les ingrédients, émotions, besoins et arômes conduisent directement à un récit existant : résumé, tradition, résonance avec les choix, repère bibliographique et lien de recherche web. La fin ne génère plus de fiction. Jusqu’à deux alternatives proches peuvent être proposées ; elles ne sont pas tirées au hasard.

La situation compte pour 6 points, le besoin pour 5, l’émotion pour 3 et l’arôme pour 1. Chaque groupe est normalisé par le nombre de choix, pour éviter que choisir plus donne artificiellement plus de poids. Ces pondérations sont éditoriales, pas une mesure psychologique. La correspondance est déterministe et explicable. Les choix « Autre » et les textes libres ne sont pas interprétés ; lorsqu’ils sont les seuls choix, l’interface indique que la piste n’est pas personnalisée précisément.

## Organisation

- `src/components/` : sélection, cuisson, arômes et découverte culturelle.
- `src/domain/catalog.js` : choix proposés dans le parcours.
- `src/domain/myths.json` : catalogue culturel structuré, actuellement 40 entrées.
- `src/domain/matching.js` : classement, raisons de la correspondance et recherche web.
- `src/domain/journey.js` : état et garde-fous du parcours.
- `src/App.jsx` : composition des étapes et focus clavier.
- `tests/` : navigation, pertinence, couverture du catalogue et confidentialité.

Le catalogue est une base initiale extensible, **pas une collection exhaustive** des traditions du monde. Voir [CATALOGUE.md](CATALOGUE.md) pour l’enrichir et documenter les versions. Les résumés et résonances sont rédigés pour cette application ; les repères bibliographiques ne sont pas des liens vers des éditions vérifiées en ligne.

Les réponses restent en mémoire : aucun envoi et aucune sauvegarde locale. Le lien de recherche transmet uniquement le titre, la tradition et le repère public du récit choisi, lorsque l’utilisateur l’ouvre. Aucun accès réseau n’est nécessaire au classement. La cuisson fonctionne au toucher et au clavier, sans diminution de la progression. Les animations respectent `prefers-reduced-motion`.

Le fichier `MARREMYTHE •°.html` reste une référence historique ; `index.html` est l’entrée React.
