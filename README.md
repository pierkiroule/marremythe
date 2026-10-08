# MARREMYTHE •°

Un atelier poétique qui transforme les ingrédients du quotidien en récits de possibles. Application React 19 et Vite 7, responsive, sans backend ni compte.

## Développement

Node.js ≥ 22.12 (Node 24 recommandé).

```sh
npm ci
npm run dev
```

```sh
npm test          # état du parcours, garde-fous, génération et confidentialité
npm run build    # application de production dans dist/
npm run preview  # vérification du build
```

Le build peut être déployé sur un hébergement statique. Les chemins d’assets sont relatifs pour permettre un déploiement en sous-répertoire.

## Organisation

- `src/components/` : sélection, marmite, arômes et restitution du récit.
- `src/domain/catalog.js` : catalogue original des ingrédients et arômes.
- `src/domain/recipe.js` : composition des récits, sans dépendance à React.
- `src/domain/history.js` : historique local validé, tolérant au stockage indisponible.
- `src/domain/journey.js` : état et transitions du parcours, limites et conditions de progression.
- `src/App.jsx` : composition des étapes et gestion du focus.
- `src/styles.css` : identité visuelle, responsive et réduction des animations.
- `tests/` : tests métier avec le runner natif Node.

Les mots saisis restent en mémoire pendant la session. Seuls des indices de fragments sont conservés dans `localStorage` pour varier les récits. Le rechargement remet le parcours à zéro. Aucun service externe ou clé API n’est nécessaire. La copie requiert un navigateur autorisant le presse-papiers ; le téléchargement texte reste disponible.

Le parcours fonctionne au clavier et au toucher. La marmite peut être remuée par déplacement du pointeur ou par un bouton ; la progression ne diminue pas, pour permettre à chacun d’avancer à son rythme. Les choix annoncés par les lecteurs d’écran respectent les limites du panier. Les animations suivent `prefers-reduced-motion`.

Le fichier `MARREMYTHE •°.html` est conservé comme référence de la version originale. L’entrée de l’application React est `index.html`.
