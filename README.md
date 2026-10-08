# La Marmythe à colère •°

« J’en ai marre. » Choisir ses colères, les jeter et découvrir une valeur possible : l’arôme de ce mélange. Si elle ressemble à l’utilisateur, il la garde dans son bouillon. React 19 / Vite 7, sans compte ni backend.

## Développement

Node.js ≥ 22.12 (Node 24 recommandé).

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
npm run test:e2e
```

Les tests navigateur utilisent Chromium système s’il est présent. Sinon, installer avec `npx playwright install chromium` ou fournir `CHROMIUM_PATH`. Le build `dist/` convient à un hébergement statique, y compris en sous-répertoire.

## Le parcours court

1. Choisir jusqu’à trois colères. Aucun choix préalable de valeur, d’émotion ou de besoin.
2. Glisser les colères dans la marmythe avec une souris ou un doigt ; au clavier, Entrée ou Espace remplace le geste. Après la dernière chute, une courte animation de 650 ms ouvre automatiquement la révélation. Aucun mélange ni secouement à effectuer.
3. Une seule bulle affiche une valeur, sa signification et « Est-ce qu’elle te ressemble ? ». « Oui, je la garde » collectionne la valeur ; « Non, je la laisse » ne conserve rien. Après un refus, une autre piste du même mélange peut être essayée, une à la fois, ou l’on peut jeter d’autres colères.

L’accueil garde la cuisine féerique, les fioles, les bulles et la marmythe illustrée. Le bouton reste immédiatement disponible.

## Comment émerge l’arôme

`src/domain/values.js` relie chaque colère prédéfinie à des valeurs possibles. Les valeurs qui reviennent dans plusieurs colères passent devant ; les égalités suivent l’ordre stable des associations. L’ordre des clics et les doublons ne changent pas le résultat.

Ce sont des pistes éditoriales, pas un diagnostic ni une vérité sur l’utilisateur. L’acceptation est toujours explicite. Pour « Autre » seul, une piste générale est clairement signalée ; les mots libres ne sont pas analysés ni envoyés. Le parcours ne demande jamais de choisir la valeur à révéler.

## Mon bouillon de valeurs

Les huit valeurs sont conservées par identifiant `value:0` à `value:7`, sous la clé `marremythe.resource-bubbles.v1`. Une valeur est collectionnée une seule fois, même si elle revient dans plusieurs mélanges. La collection permet de la relire et de la retirer ; elle survit au rechargement et au redémarrage du parcours.

Les mots personnels restent en mémoire et disparaissent au rechargement ou au redémarrage. Le bouillon reste dans ce navigateur et peut être visible aux autres personnes qui l’utilisent. Si le stockage est bloqué, les valeurs restent disponibles pendant la session et l’interface le signale. Les données inconnues sont filtrées.

Les anciennes bulles de mythes, de valeurs contextualisées et d’univers créatifs restent accessibles dans « Mes anciennes bulles », sans être comptées comme de nouvelles valeurs acceptées. Le catalogue culturel de 40 récits et ses sources sont conservés pour ces anciennes collections ; les mythes et l’atelier ne constituent plus une étape du parcours principal. Voir [CATALOGUE.md](CATALOGUE.md).

## Effets et accessibilité

Un canvas produit traînées, éclats, bulles et confettis, avec un budget plafonné (650 sur appareil tactile, 1 100 sur bureau, ajusté si les frames ralentissent). Il se suspend dans les onglets masqués et pendant la consultation du bouillon, y compris avec des fenêtres imbriquées. `prefers-reduced-motion` supprime les animations et les particules sans bloquer le parcours.

La musique rétro originale est synthétisée avec Web Audio et démarre uniquement sur demande. Elle peut être coupée et se suspend quand l’onglet est masqué. Le clavier, le focus de révélation, les fenêtres modales et les décisions restent accessibles.

## Organisation

- `src/domain/journey.js` : sélection des colères et transition après les chutes.
- `src/domain/values.js` : valeurs publiques et propositions d’arômes.
- `src/components/Cauldron.jsx` : glissement, chute et apparition automatique.
- `src/components/Discovery.jsx` : une bulle et une décision.
- `src/domain/bubbles.js` et `src/hooks/useResourceCollection.js` : validation, collection et compatibilité des anciens identifiants.
- `src/components/ResourceCollection.jsx` : valeurs acceptées et accès aux anciennes bulles.
- `src/domain/myths.json`, `matching.js` et `projective.js` : patrimoine culturel conservé pour les anciennes collections.
- `tests/` : règles métier et parcours navigateur.
