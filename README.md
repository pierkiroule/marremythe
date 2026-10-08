# MARREMYTHE •°

« J’en ai marre. » Quelques ingrédients, une marmite et un mythe ou une légende qui résonne. React 19 / Vite 7, sans compte ni backend.

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

Les tests navigateur utilisent Chromium système s’il est présent. Sinon, installer le navigateur avec `npx playwright install chromium`, ou fournir `CHROMIUM_PATH`. Le build `dist/` convient à un hébergement statique, y compris en sous-répertoire.

## Trois temps

1. Choisir ce qui pèse et le besoin recherché sur une seule page. Les émotions sont facultatives.
2. Glisser les ingrédients dans la marmite, avec une souris ou un doigt. Un simple clic ne les jette pas ; au clavier, Entrée ou Espace remplace le glissement. Sur smartphone, activer le secouement puis secouer le téléphone ; cinq impulsions de mélange suffisent. La découverte s’ouvre automatiquement.
3. Découvrir un récit existant : résumé, tradition, résonance avec les choix, repère bibliographique et recherche web. Les alternatives proches ne sont pas choisies au hasard.

## Mouvement et accessibilité

Le mouvement nécessite HTTPS (ou localhost), un navigateur exposant `DeviceMotionEvent` et des capteurs physiques. Sur iOS, l’autorisation est demandée depuis le bouton « Activer le secouement ». Un refus, l’absence de capteurs ou de données ne bloque pas le parcours : « Mélanger sans secouer » reste disponible. Les données sont traitées localement, sans sauvegarde ni envoi. Le détecteur mesure les variations d’accélération, avec un seuil et un délai entre impulsions ; il n’assimile pas la gravité au repos à un secouement. Aucun mouvement n’est traité quand la page est masquée.

Les tests automatisés couvrent le glissement réel à la souris et au toucher, le clavier, les autorisations simulées, les capteurs silencieux, le refus et les impulsions simulées. Ils ne remplacent pas une validation matérielle sur de vrais téléphones iOS/Android.

## Effets et son

Un canvas produit des traînées, éclats, bulles et confettis. Le nombre de particules est plafonné (650 sur appareils tactiles, 1 100 sur bureau, avec diminution si les frames ralentissent). Les effets s’arrêtent dans un onglet masqué et sont désactivés avec `prefers-reduced-motion`.

La musique rétro est une composition originale synthétisée avec Web Audio : progression harmonique, plusieurs motifs mélodiques, contrechant, arpèges, basse et percussions. Aucun enregistrement ni morceau de jeu commercial n’est utilisé. Le son démarre uniquement après « Activer le son », peut être coupé, et se suspend quand l’onglet est masqué. Les jets et le mélange ont leurs propres petits effets sonores.

## Organisation

- `src/components/` : choix, marmite, découverte, canvas et contrôle du son.
- `src/hooks/useShake.js` et `src/domain/shake.js` : autorisation et détection du secouement.
- `src/audio/RetroMusic.js` : synthèse musicale et effets.
- `src/effects/particles.js` : événements visuels et sonores.
- `src/domain/myths.json` : 40 entrées culturelles ; voir [CATALOGUE.md](CATALOGUE.md).
- `src/domain/matching.js` : classement explicable ; situation 6 points, besoin 5 et émotion 3, normalisés par groupe. Les anciens tags d’arômes restent dans les données pour une éventuelle extension mais cette étape a été retirée du parcours.
- `src/domain/journey.js` : état et garde-fous des trois étapes.
- `tests/` : tests métier et navigateur.

Le catalogue est une base initiale extensible, **pas une collection exhaustive** des traditions du monde. Les résumés et résonances sont rédigés pour cette application ; les références sont des points de départ bibliographiques.

Les réponses restent en mémoire : aucun envoi ni stockage local. Les mots libres ne sont pas analysés. Les choix « Autre » seuls affichent une piste générale clairement signalée. Le lien de recherche transmet uniquement les métadonnées publiques du récit lorsqu’il est ouvert.

`MARREMYTHE •°.html` est la référence historique ; `index.html` est l’entrée React.
