# La Marmythe à colère •°

« J’en ai marre. » Jeter ses colères dans la marmythe, clarifier les valeurs que l’on veut défendre et rencontrer un mythe qui leur fait écho. React 19 / Vite 7, sans compte ni backend.

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

Avant les choix, un accueil présente la cuisine féerique de la Marmythe à colère : marmite illustrée, fioles, vapeur, bulles colorées et titre qui émerge du bouillon. Un court message explique le parcours et le bouton « Je jette mes colères ! » ouvre immédiatement les choix, sans attendre l’animation. Le bouillon et le contrôle du son restent accessibles dès l’accueil ; la musique ne démarre pas automatiquement. Cet accueil apparaît à chaque chargement, sans ajouter de préférence persistante.

1. Choisir jusqu’à trois colères, puis jusqu’à deux valeurs qui comptent pour soi. Des suggestions aident à explorer le lien, sans présélection ni interprétation des mots personnels. Les émotions derrière la colère sont facultatives.
2. Glisser les ingrédients dans la marmite, avec une souris ou un doigt. Un simple clic ne les jette pas ; au clavier, Entrée ou Espace remplace le glissement. Sur smartphone, activer le secouement puis secouer le téléphone ; cinq impulsions de mélange suffisent. La découverte s’ouvre automatiquement.
3. Explorer six bulles d’un univers à inventer : valeurs, décor, quête, alliés, atelier et inspirations. Dans « À toi d’inventer », clarifier ses valeurs, nommer son personnage et modifier le lieu, la quête et l’allié, facultativement. L’amorce se compose à partir de ces ingrédients et laisse la fin ouverte. La bulle « Les inspirations » distingue cette création du récit traditionnel, donne son résumé, sa source et un lien de recherche. Les alternatives proches changent d’univers tout en conservant le classement culturel.

## Mouvement et accessibilité

Le mouvement nécessite HTTPS (ou localhost), un navigateur exposant `DeviceMotionEvent` et des capteurs physiques. Sur iOS, l’autorisation est demandée depuis le bouton « Activer le secouement ». Un refus, l’absence de capteurs ou de données ne bloque pas le parcours : « Mélanger sans secouer » reste disponible. Les données sont traitées localement, sans sauvegarde ni envoi. Le détecteur mesure les variations d’accélération, avec un seuil et un délai entre impulsions ; il n’assimile pas la gravité au repos à un secouement. Aucun mouvement n’est traité quand la page est masquée.

Les tests automatisés couvrent le glissement réel à la souris et au toucher, le clavier, les autorisations simulées, les capteurs silencieux, le refus et les impulsions simulées. Ils ne remplacent pas une validation matérielle sur de vrais téléphones iOS/Android.

## Effets et son

Un canvas produit des traînées, éclats, bulles et confettis. Le nombre de particules est plafonné (650 sur appareils tactiles, 1 100 sur bureau, avec diminution si les frames ralentissent). Les effets s’arrêtent dans un onglet masqué et sont désactivés avec `prefers-reduced-motion`.

L’accueil ajoute 28 bulles animées en CSS et des jets de particules depuis la marmite. Les jets sont suspendus quand l’onglet est masqué et leurs minuteries sont nettoyées en quittant l’accueil. Avec une préférence de mouvement réduit, le titre est immédiatement visible, les animations sont supprimées et quelques bulles décoratives restent fixes. Le focus arrive sur le titre de la première étape après le bouton de départ. Les effets ambiants sont plus discrets pendant les choix ; le canvas se suspend pendant la lecture et la consultation du bouillon, y compris avec des fenêtres imbriquées, puis reprend après leur fermeture.

La musique rétro est une composition originale synthétisée avec Web Audio : progression harmonique, plusieurs motifs mélodiques, contrechant, arpèges, basse et percussions. Aucun enregistrement ni morceau de jeu commercial n’est utilisé. Le son démarre uniquement après « Activer le son », peut être coupé, et se suspend quand l’onglet est masqué. Les jets et le mélange ont leurs propres petits effets sonores.

## Organisation

- `src/components/` : choix, marmite, découverte, canvas et contrôle du son.
- `src/hooks/useShake.js` et `src/domain/shake.js` : autorisation et détection du secouement.
- `src/audio/RetroMusic.js` : synthèse musicale et effets.
- `src/effects/particles.js` : événements visuels et sonores.
- `src/domain/myths.json` : 40 entrées culturelles ; voir [CATALOGUE.md](CATALOGUE.md).
- `src/domain/matching.js` : classement explicable ; colère 5 points, valeur 7 et émotion 2, normalisés par groupe. Les anciens tags d’arômes restent dans les données pour une éventuelle extension mais cette étape a été retirée du parcours.
- `src/domain/journey.js` : état et garde-fous des trois étapes.
- `tests/` : tests métier et navigateur.

Le catalogue est une base initiale extensible, **pas une collection exhaustive** des traditions du monde. Les résumés et résonances sont rédigés pour cette application ; les références sont des points de départ bibliographiques.

Les réponses et les notes de réflexion restent en mémoire : aucun envoi ni stockage local de ces réponses. La collection de bulles publiques peut, elle, être conservée sur l’appareil. Les notes sont distinctes pour chaque récit et disparaissent lorsque l’on recharge, recommence ou revient modifier les ingrédients. Les mots libres ne sont pas analysés. Les choix « Autre » seuls affichent une piste générale clairement signalée. Le lien de recherche transmet uniquement les métadonnées publiques du récit lorsqu’il est ouvert.

`MARREMYTHE •°.html` est la référence historique ; `index.html` est l’entrée React.

## La révélation en bulles

Après le mélange, six bulles colorées occupent l’écran : « Mes valeurs », « Le décor », « La quête », « Les alliés », « À toi d’inventer » et « Les inspirations ». On choisit l’ordre et on peut garder ou laisser chaque bulle. La croix ou Échap propose ce choix si la bulle n’est pas encore conservée. Les fenêtres gèrent le focus clavier, la suspension des particules et le retour à la bulle d’origine. Les anciens identifiants du bouillon restent lisibles.

Le bouton « Mon bouillon » permet de retrouver, relire et retirer les bulles choisies, même après un nouveau parcours ou un rechargement. La collection est enregistrée uniquement dans ce navigateur, sous la clé `marremythe.resource-bubbles.v1`. Elle contient des identifiants de textes publics, jamais les réponses personnelles ou les mots saisis. Les textes affichés correspondent à la version actuelle du catalogue. Sur un navigateur partagé, d’autres personnes utilisant ce navigateur peuvent voir les bulles conservées.

Si le stockage local est bloqué, la collection fonctionne en mémoire pendant la session et l’interface le signale. Les données inconnues, corrompues et les doublons sont filtrés à la lecture. Les réponses facultatives aux questions restent temporaires et ne sont pas ajoutées au bouillon.

## Des univers à laisser mijoter

`src/domain/projective.js` contient 40 ensembles de motifs originaux, un pour chaque inspiration culturelle : titre, personnage, décor sensoriel, obstacle, objet et allié. Le classement des récits reste fondé sur les choix du parcours ; les valeurs choisies orientent ensuite la quête. Il s’agit d’une composition locale de textes préparés, sans service d’IA, appel réseau ni diagnostic. L’application ne présente jamais ces inventions comme des versions traditionnelles des récits.

L’atelier propose des suggestions et quatre champs facultatifs. L’amorce se met à jour sans validation ni étape supplémentaire et trois questions invitent à imaginer les valeurs, les aides et un premier geste. Chaque univers a son propre brouillon dans le parcours. Ces mots restent en mémoire et disparaissent à la modification du parcours, au redémarrage ou au rechargement ; un atelier rouvert depuis la collection garde ses mots seulement jusqu’à la fermeture de sa fenêtre.

Le bouillon conserve l’identifiant de la version de départ de la bulle, jamais le nom du personnage, le décor personnel, la quête personnalisée ou les réponses. Les bulles créatives relues dans la collection utilisent les ingrédients publics de départ, sans les personnalisations de l’atelier. La bulle « Mes valeurs » fait exception : elle conserve les valeurs explicitement choisies. L’interface indique cette distinction avant la conservation. Les 240 anciens identifiants culturels et les 240 identifiants de pistes créatives restent lisibles ; les variantes publiques de la bulle de valeurs s’y ajoutent.

## Colères → valeurs → mythe

Le catalogue de valeurs est défini dans `src/domain/values.js` : liberté, solidarité, équilibre, reconnaissance, sens, justice et respect, lien et renouveau, plus « Autre ». Les liens suggérés depuis les colères sont des possibilités à choisir, jamais un diagnostic. Le champ interne `need` sert désormais aux choix de valeurs ; les anciens tags `need` du catalogue restent conservés pour la compatibilité documentaire. Le classement utilise les nouveaux tags `values`, renseignés pour les 40 récits. Quand une valeur précise est choisie, chaque récit proposé fait écho à au moins une valeur sélectionnée. « Autre » seul reste une piste générale sans valeur imposée.

La révélation montre les valeurs choisies, leurs significations et le récit qui inspire l’univers. La quête et les trois questions portent sur ce que la colère aimerait défendre et sur un geste possible. La bulle « Mes valeurs » conserve exactement les valeurs explicitement choisies grâce à un identifiant public `mythId:values:indices`, sans enregistrer de texte libre. Les autres bulles gardent leurs ingrédients publics de départ. Les anciens identifiants du bouillon restent lisibles.
