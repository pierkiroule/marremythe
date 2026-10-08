# Enrichir le catalogue culturel

L’objectif est une base aussi riche que possible de mythes et légendes, permettant de découvrir une ressource culturelle à partir des choix du parcours. Le corpus initial de 40 entrées inclut aussi des contes et récits épiques, explicitement identifiés. Il ne couvre pas exhaustivement les traditions représentées et ne prétend pas représenter toutes les cultures.

## Une entrée, une version identifiable

Chaque objet de `src/domain/myths.json` contient :

| Champ         | Contenu                                                             |
| ------------- | ------------------------------------------------------------------- |
| `id`          | Identifiant stable et unique                                        |
| `title`       | Nom du récit, sans titre inventé pour l’utilisateur                 |
| `kind`        | Mythe, légende, conte, récit épique ou figure mythologique          |
| `tradition`   | Origine ou contexte culturel précis                                 |
| `emoji`       | Illustration légère                                                 |
| `source`      | Repère bibliographique et version résumée                           |
| `summary`     | Résumé fidèle, rédigé pour l’application                            |
| `resource`    | Lecture possible des motifs, distincte du récit traditionnel        |
| `nourishment` | Besoin, capacité ou condition de vie que cette lecture peut nourrir |
| `questions`   | Trois invitations spécifiques : perspective, ressource, possibilité |
| `tags`        | Situations, émotions, besoins et arômes associés                    |
| `searchQuery` | Recherche publique ciblant le récit et sa source                    |

Éviter de mélanger des variantes sans l’indiquer. Conserver la différence entre source ancienne, transmission orale et collecte moderne. Une édition issue d’une collecte ne suffit pas à épuiser une tradition vivante. Les récits violents ou les fins tragiques doivent être résumés fidèlement, sans transformer leur dénouement en promesse heureuse. Une lecture symbolique est une proposition éditoriale, pas un diagnostic de la personne ni une affirmation de la signification universelle du récit.

Les repères actuels constituent des points de départ bibliographiques. Pour développer une base documentaire exhaustive, compléter la vérification éditoriale par des éditions accessibles, des traductions identifiées et des ressources d’institutions ou de communautés concernées. Ne pas annoncer une vérification en ligne qui n’a pas été effectuée.

## Index des associations

Le parcours actuel ne demande plus d’arôme : les tags `aroma` sont conservés pour les données et des extensions futures, mais ne contribuent pas aux réponses actuelles. Les émotions sont facultatives.

Les indices suivent l’ordre de `src/domain/catalog.js`. Ne pas réordonner les choix sans migrer les tags et les tests.

- `type` : 0 fardeau, 1 boucle, 2 cage, 3 invisible, 4 bataille, 5 brouillard, 6 épuisement, 7 décalage, 8 attente, 9 blessure.
- `emotion` : 0 colère, 1 tristesse, 2 peur, 3 fatigue, 4 impuissance, 5 confusion, 6 solitude, 7 déception.
- `need` : 0 liberté, 1 soutien, 2 repos, 3 reconnaissance, 4 sens, 5 sécurité, 6 lien, 7 renouveau.
- `aroma` : 0 clé, 1 pont, 2 graine, 3 plume, 4 étoile, 5 braise, 6 rivière, 7 fil, 8 lanterne, 9 miel.

N’ajouter que des associations défendables à partir du récit. Ne pas associer chaque récit à tout pour augmenter sa visibilité. Les tags « Autre » sont exclus : les mots libres ne sont ni analysés ni transmis à la recherche web.

## Vérification

Exécuter `npm test` et `npm run build`. Ajouter des exemples de profils dans `tests/matching.test.js` pour vérifier les distinctions utiles, par exemple répétition/sens → Sisyphe et confusion/soutien → Ariane. Vérifier aussi les cas où l’utilisateur sélectionne plusieurs situations, les besoins qui changent le classement et les choix « Autre ». Les égalités de score favorisent les associations les plus spécifiques (un récit centré sur un motif plutôt qu’un récit tagué très largement), puis se départagent par identifiant, sans effet de hasard ou historique invisible.

## Écriture des récits et des invitations

Les 40 résumés sont des réécritures évocatrices en deux paragraphes. Les accents sensoriels rendent les images présentes sans ajouter un épisode, un dialogue attribué ou une fin absents de la version indiquée. Ils ne sont pas des citations d’une édition. Une référence peut couvrir plusieurs passages : l’épisode du relais d’Atlas nécessite ainsi le Pseudo-Apollodore en complément d’Hésiode.

Séparer la trame traditionnelle (`summary`) de la lecture proposée (`resource`). Une lecture positive vise les conditions dans lesquelles la personne peut retrouver des appuis et du choix ; elle conserve les pertes, les contraintes et les fins tragiques. Elle n’oblige pas à considérer une épreuve comme bénéfique. Le champ `nourishment` nomme brièvement ce qui peut être nourri : lien, marge de décision, repos, reconnaissance, sens ou protection, selon le récit.

Les questions s’inspirent d’approches narratives et orientées vers les solutions. Elles aident la personne à élaborer sa propre lecture ; elles ne constituent pas une évaluation ou un protocole de soin.

1. `perspective` : donner un contour à ce qui pèse, distinguer la personne du problème, faire apparaître ce qui compte pour elle.
2. `resource` : chercher une exception, un appui, un savoir-faire ou une trace de capacité déjà accessible. Laisser ouverte la possibilité qu’aucun exemple ne vienne immédiatement.
3. `possibility` : préciser un besoin et imaginer une différence souhaitée ou un petit pas réaliste, choisi par la personne.

Rédiger les trois questions à partir des motifs propres au récit. Éviter les formulations culpabilisantes, les injonctions à pardonner ou à se dépasser, les promesses, les diagnostics et les compliments automatiques. Ne pas présupposer qu’un lien est sûr ni que davantage de persévérance est toujours la solution. Une limite, un relais, un repos ou une attente choisie peuvent être des ressources.

Les différentes traditions peuvent offrir des motifs qui résonnent entre eux sans former une interprétation unique ou une sagesse interchangeable. La personne garde le droit de déplacer ou de laisser la lecture proposée.

Les réponses facultatives sont gardées uniquement dans l’état React de la page, distinctes pour chaque récit. Elles ne sont ni analysées, ni utilisées pour classer les récits, ni ajoutées à la recherche web. Elles s’effacent au rechargement, au recommencement ou lorsque l’on revient modifier les ingrédients.

## Ton pour les adolescents

Le public visé est celui des adolescents, avec des phrases directes, sans vocabulaire de consultation ni imitation d’argot. Les réécritures conservent les actions importantes et les fins des histoires. Expliquer les éléments inconnus dans la phrase (par exemple, un centaure), et garder les références bibliographiques à part.

Les interprétations peuvent utiliser des situations proches : cours, amis, maison, activités et temps libre. Ce sont des exemples, pas des suppositions sur la vie de la personne. Une question doit pouvoir se lire seule, demander une chose claire et laisser la possibilité de ne pas répondre. Les limites de longueur vérifiées par les tests servent de garde-fous éditoriaux ; elles ne prouvent pas la compréhension par de vrais adolescents.

Éviter « ouvrir des possibles », « nourrir une ressource », les compliments automatiques, les leçons et le ton infantilisant. Préférer nommer une aide, un besoin, un choix ou un changement concret. Le vocabulaire des champs techniques (`nourishment`, `resource`, etc.) reste interne. Une lecture avec le public visé reste utile pour ajuster les mots et les exemples.

## Bulles et collection

Chaque récit fournit six bulles : `story`, `resource`, `idea`, puis `question-perspective`, `question-resource` et `question-possibility`. Les identifiants combinent le nom stable du récit et le type de bulle. Ces textes peuvent être gardés dans la collection locale ; les réponses de la personne ne sont jamais incluses. Une entrée du catalogue modifiée met à jour le texte des bulles conservées correspondantes. Le lecteur choisit ce qui lui parle : explorer toutes les bulles ou les conserver n’est pas obligatoire.

### Pistes créatives

Les 40 récits restent les références culturelles du classement. Leurs résumés ne sont pas remplacés par les inventions : la bulle « Les inspirations » les affiche avec leurs sources. `src/domain/projective.js` ajoute pour chacun un univers librement revisité et explicitement identifié comme une création : lieu sensoriel, obstacle, objet, allié et amorce sans fin imposée. Les besoins choisis composent la quête et l’atelier laisse le personnage, le lieu et la suite au choix de l’utilisateur. Ces textes sont composés localement, sans génération distante. Les identifiants `mythId:projective:key` coexistent avec les anciens identifiants du bouillon.
