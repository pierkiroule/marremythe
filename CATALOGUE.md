# Enrichir le catalogue culturel

L’objectif est une base aussi riche que possible de mythes et légendes, permettant de découvrir une ressource culturelle à partir des choix du parcours. Le corpus initial de 40 entrées inclut aussi des contes et récits épiques, explicitement identifiés. Il ne couvre pas exhaustivement les traditions représentées et ne prétend pas représenter toutes les cultures.

## Une entrée, une version identifiable

Chaque objet de `src/domain/myths.json` contient :

| Champ         | Contenu                                                      |
| ------------- | ------------------------------------------------------------ |
| `id`          | Identifiant stable et unique                                 |
| `title`       | Nom du récit, sans titre inventé pour l’utilisateur          |
| `kind`        | Mythe, légende, conte, récit épique ou figure mythologique   |
| `tradition`   | Origine ou contexte culturel précis                          |
| `emoji`       | Illustration légère                                          |
| `source`      | Repère bibliographique et version résumée                    |
| `summary`     | Résumé fidèle, rédigé pour l’application                     |
| `resource`    | Lecture possible des motifs, distincte du récit traditionnel |
| `tags`        | Situations, émotions, besoins et arômes associés             |
| `searchQuery` | Recherche publique ciblant le récit et sa source             |

Éviter de mélanger des variantes sans l’indiquer. Conserver la différence entre source ancienne, transmission orale et collecte moderne. Une édition issue d’une collecte ne suffit pas à épuiser une tradition vivante. Les récits violents ou les fins tragiques doivent être résumés fidèlement, sans transformer leur dénouement en promesse heureuse. Une lecture symbolique est une proposition éditoriale, pas un diagnostic de la personne ni une affirmation de la signification universelle du récit.

Les repères actuels constituent des points de départ bibliographiques. Pour développer une base documentaire exhaustive, compléter la vérification éditoriale par des éditions accessibles, des traductions identifiées et des ressources d’institutions ou de communautés concernées. Ne pas annoncer une vérification en ligne qui n’a pas été effectuée.

## Index des associations

Les indices suivent l’ordre de `src/domain/catalog.js`. Ne pas réordonner les choix sans migrer les tags et les tests.

- `type` : 0 fardeau, 1 boucle, 2 cage, 3 invisible, 4 bataille, 5 brouillard, 6 épuisement, 7 décalage, 8 attente, 9 blessure.
- `emotion` : 0 colère, 1 tristesse, 2 peur, 3 fatigue, 4 impuissance, 5 confusion, 6 solitude, 7 déception.
- `need` : 0 liberté, 1 soutien, 2 repos, 3 reconnaissance, 4 sens, 5 sécurité, 6 lien, 7 renouveau.
- `aroma` : 0 clé, 1 pont, 2 graine, 3 plume, 4 étoile, 5 braise, 6 rivière, 7 fil, 8 lanterne, 9 miel.

N’ajouter que des associations défendables à partir du récit. Ne pas associer chaque récit à tout pour augmenter sa visibilité. Les tags « Autre » sont exclus : les mots libres ne sont ni analysés ni transmis à la recherche web.

## Vérification

Exécuter `npm test` et `npm run build`. Ajouter des exemples de profils dans `tests/matching.test.js` pour vérifier les distinctions utiles, par exemple répétition/sens → Sisyphe et confusion/soutien → Ariane. Vérifier aussi les cas où l’utilisateur sélectionne plusieurs situations, les besoins qui changent le classement et les choix « Autre ». Les égalités de score se départagent par identifiant, sans effet de hasard ou historique invisible.
