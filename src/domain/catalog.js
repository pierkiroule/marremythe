const TY = [
  [
    "🪨",
    "Le fardeau",
    "Tout porter",
    "des épaules lourdes",
    [
      "Dans la vallée des Épaules, chaque pas faisait tinter une pierre de plus au fond des sacs.",
      "Au village, on se passait le ciel à tour de rôle, et personne ne se rappelait qui l’avait confié.",
      "Sur la route du col, les sacs poussaient comme des champignons : un par promesse tenue trop vite.",
    ],
    [
      [
        "Atlas",
        "le poids du monde et la question de ce que l’on choisit de porter",
      ],
      [
        "Saint Christophe",
        "le passeur dont la charge change de nature à mesure qu’il traverse",
      ],
    ],
  ],
  [
    "🔁",
    "La boucle",
    "Toujours pareil",
    "de la roue qui tourne",
    [
      "Là-bas, le soleil se levait toujours à la même minute, au-dessus de la même tasse posée au même endroit.",
      "Les jours s’y empilaient comme des assiettes identiques, et chacun portait le même numéro.",
      "Le moulin du bourg tournait sans farine, par habitude, et tout le monde faisait semblant d’y croire.",
    ],
    [
      [
        "Sisyphe",
        "la répétition et la possibilité de changer son rapport à l’effort",
      ],
      ["Ixion", "la roue qui tourne et l’art d’apprendre à en descendre"],
    ],
  ],
  [
    "🔒",
    "La cage",
    "Être coincé",
    "des murs qui respirent",
    [
      "Les murs du royaume se rapprochaient chaque nuit d’un doigt, et les fenêtres rapetissaient en silence.",
      "On y vivait dans une tour dont l’escalier ne montait jamais, ni ne descendait vraiment.",
      "Les portes y étaient nombreuses, mais chacune s’ouvrait sur une pièce identique à la précédente.",
    ],
    [
      ["Dédale", "l’enfermement, l’invention d’une issue et le fil du chemin"],
      [
        "Prométhée enchaîné",
        "la contrainte, l’entêtement et ce que l’on garde de soi malgré les chaînes",
      ],
    ],
  ],
  [
    "👻",
    "L’invisible",
    "Ne pas compter",
    "de l’invisible",
    [
      "Dans la ville de verre, on se traversait comme des courants d’air, sans que personne ne se retourne.",
      "Les mots y tombaient en silence, comme des gouttes sur du sable sec.",
      "Au banquet du royaume, il y avait mille couverts, mais aucun ne portait son nom.",
    ],
    [
      ["Psyché", "la reconnaissance, les épreuves et la découverte de soi"],
      [
        "Écho",
        "la voix que l’on renvoie aux autres, jusqu’à retrouver la sienne",
      ],
    ],
  ],
  [
    "⚔️",
    "La bataille",
    "Toujours lutter",
    "des mille combats",
    [
      "Le pays n’était qu’une longue frontière, et chaque matin demandait de reprendre le même bouclier.",
      "Les épées y repoussaient comme l’herbe : à peine coupées, déjà debout.",
      "Même la soupe, dans ce royaume, se mangeait au garde-à-vous.",
    ],
    [
      ["Héraclès", "les épreuves, la force et ses limites"],
      ["Achille", "la puissance et la vulnérabilité qu’elle abrite"],
    ],
  ],
  [
    "🌫️",
    "Le brouillard",
    "Ne plus comprendre",
    "des brumes",
    [
      "Une brume douce recouvrait les routes, et les panneaux s’y répondaient sans jamais s’accorder.",
      "On y marchait à tâtons, et chaque lanterne n’éclairait que son propre halo.",
      "Les cartes du pays y changeaient de forme à mesure qu’on les dépliait.",
    ],
    [
      [
        "Thésée et Ariane",
        "la traversée du labyrinthe et l’importance du fil des liens",
      ],
      ["Œdipe", "l’énigme, la quête de sens et la connaissance de soi"],
    ],
  ],
  [
    "🪫",
    "L’épuisement",
    "Ne plus avoir d’énergie",
    "des saisons fatiguées",
    [
      "Le royaume vivait un long automne : les feuilles tombaient, mais plus rien ne se préparait à repousser.",
      "Les horloges y ralentissaient, et même le vent s’appuyait souvent contre les murs pour souffler.",
      "Les fours du village s’éteignaient les uns après les autres, faute de souffle.",
    ],
    [
      [
        "Déméter et Perséphone",
        "les saisons intérieures, la perte et le retour du vivant",
      ],
      ["Antée", "la force qui revient au contact de la terre"],
    ],
  ],
  [
    "🧩",
    "Le décalage",
    "Ne pas trouver ma place",
    "de la rive d’à côté",
    [
      "Dans le pays des pièces assorties, il manquait toujours une encoche à la pièce qui cherchait sa forme.",
      "À chaque table, on tendait une chaise un peu trop haute, ou un peu trop loin.",
      "Les cartes y indiquaient mille places, mais aucune ne portait de nom.",
    ],
    [
      ["Ulysse", "l’errance, l’appartenance et le retour transformé"],
      ["Les Argonautes", "chercher sa place dans un équipage dépareillé"],
    ],
  ],
  [
    "⏳",
    "L’attente",
    "Rien ne bouge",
    "du fil patient",
    [
      "Le sablier du royaume restait en suspens, et les grains attendaient, poliment, de savoir quoi faire.",
      "On y guettait l’horizon depuis si longtemps que l’horizon avait fini par s’asseoir aussi.",
      "Les saisons y faisaient la queue devant une porte qui ne s’ouvrait pas.",
    ],
    [
      [
        "Pénélope",
        "l’attente, la persévérance et le pouvoir de tisser autrement",
      ],
      [
        "Pandore",
        "l’espérance restée au fond de la jarre, quand tout semblait s’échapper",
      ],
    ],
  ],
  [
    "💔",
    "La blessure",
    "Ce qui fait mal",
    "de la fêlure dorée",
    [
      "Au cœur du pays courait une fêlure, et chacun marchait doucement autour, comme autour d’un lac gelé.",
      "Les cloches du village sonnaient un peu faux, depuis un jour que plus personne n’osait nommer.",
      "Dans la maison aux mille tasses, une seule était ébréchée, et c’était toujours celle qu’on servait.",
    ],
    [
      ["Chiron", "la blessure et la sagesse qui peut parfois en émerger"],
      ["Philoctète", "la blessure qui isole, puis qui rappelle aux autres"],
    ],
  ],
  [
    "✳️",
    "Autre",
    "Ma propre plainte",
    "du chaudron secret",
    [
      "Le pays avait un nom que personne n’osait prononcer à voix haute, et pourtant tout le monde y vivait.",
      "Dans cette contrée sans carte, chaque jour ressemblait à une question pas encore posée.",
      "Les horloges y marquaient une heure inconnue, mais le chaudron, lui, savait.",
    ],
    [
      [
        "Hermès",
        "le messager qui traverse les seuils et fait circuler le sens",
      ],
      ["Ulysse", "l’errance, l’appartenance et le retour transformé"],
    ],
  ],
];
const EM = [
  [
    "😤",
    "Colère",
    [
      "brûlant comme une braise oubliée sous la cendre",
      "piquant, avec de petits éclairs rouges au fond",
    ],
  ],
  [
    "😢",
    "Tristesse",
    [
      "bleu-gris, lourd comme une pluie d’automne",
      "salé, avec de longues vagues lentes sur les bords",
    ],
  ],
  [
    "😰",
    "Peur",
    [
      "tremblant, plein de bruits derrière les portes",
      "froid et vif, aux aguets de la moindre vapeur",
    ],
  ],
  [
    "😮‍💨",
    "Fatigue",
    [
      "lent, épais, comme du miel qui renonce à couler",
      "tiède et sans élan, à bout de souffle",
    ],
  ],
  [
    "😞",
    "Impuissance",
    [
      "tiède, les mains vides dans la vapeur",
      "gris, sans prise, glissant entre les doigts",
    ],
  ],
  [
    "😵‍💫",
    "Confusion",
    [
      "trouble, plein de fumées qui changent de forme",
      "brouillé, avec cent saveurs qui parlaient en même temps",
    ],
  ],
  [
    "😔",
    "Solitude",
    [
      "silencieux, avec une seule bulle qui tournait en rond",
      "très calme, trop grand pour une seule cuillère",
    ],
  ],
  [
    "🥺",
    "Déception",
    [
      "fade, avec un goût de promesse renversée",
      "amer au bord, comme un gâteau sorti trop tôt",
    ],
  ],
  ["✳️", "Autre"],
];
const NE = [
  [
    "🕊️",
    "Liberté",
    "la liberté",
    "un peu de ciel ouvert",
    [
      "ouvre une fenêtre cinq minutes et choisis une chose que tu ne feras pas aujourd’hui",
      "dis « non merci » à une petite demande, juste pour sentir ta marge",
    ],
  ],
  [
    "🫂",
    "Soutien",
    "le soutien",
    "une feuille de laurier de confiance",
    [
      "envoie un message simple à quelqu’un : « Tu as dix minutes pour moi ? »",
      "demande une aide minuscule, de celles qu’on donne en une minute",
    ],
  ],
  [
    "🌿",
    "Repos",
    "le repos",
    "une branche de thym tranquille",
    [
      "pose un moment sans écran, les mains ouvertes, le temps d’une tisane",
      "coupe une tâche en deux et offre-toi la seconde moitié demain",
    ],
  ],
  [
    "✨",
    "Reconnaissance",
    "la reconnaissance",
    "un zeste d’éclat",
    [
      "note trois choses que tu as tenues aujourd’hui, même minuscules",
      "dis merci à quelqu’un pour un détail précis",
    ],
  ],
  [
    "🧭",
    "Sens",
    "le sens",
    "une étoile d’anis",
    [
      "écris une phrase qui commence par « Ce qui compte pour moi, c’est… »",
      "choisis un geste de ta journée et relie-le à une valeur",
    ],
  ],
  [
    "🛡️",
    "Sécurité",
    "la sécurité",
    "un grain de sel de terre",
    [
      "repère un lieu ou un objet qui t’apaise et passes-y deux minutes",
      "écris ce qui est solide ce soir, même si c’est peu",
    ],
  ],
  [
    "🤝",
    "Lien",
    "le lien",
    "une poignée de basilic partagé",
    [
      "partage un repas, une marche ou un café avec quelqu’un, sans programme",
      "raconte à quelqu’un un petit moment de ta journée",
    ],
  ],
  [
    "🌱",
    "Renouveau",
    "le renouveau",
    "un brin de ciboulette neuve",
    [
      "change un détail de ton rituel du matin",
      "essaie quelque chose de nouveau pendant dix minutes, sans objectif",
    ],
  ],
  [
    "✳️",
    "Autre",
    "ce qui manquait",
    "une herbe sans nom",
    [
      "choisis un tout petit geste qui t’est doux, et fais-le aujourd’hui",
      "pose-toi la question : « De quoi aurais-je besoin, là, maintenant ? »",
    ],
  ],
];
const BU = [
  [
    "🗝️",
    "La clé",
    "ouvrir une porte inconnue",
    "découvrit que certaines portes n’attendent pas une force nouvelle, mais une autre manière de les regarder",
  ],
  [
    "🌉",
    "Le pont",
    "relier deux rives",
    "apprit qu’un passage peut se construire sans effacer ce qui sépare",
  ],
  [
    "🌱",
    "La graine",
    "semer un possible",
    "comprit qu’un commencement minuscule peut déplacer toute une histoire",
  ],
  [
    "🪶",
    "La plume",
    "alléger le voyage",
    "découvrit qu’avancer ne signifie pas tout emporter",
  ],
  [
    "⭐",
    "L’étoile",
    "suivre une lueur lointaine",
    "apprit à s’orienter même quand le chemin reste incertain",
  ],
  [
    "🔥",
    "La braise",
    "garder une flamme vivante",
    "comprit que la chaleur d’un seul geste suffit parfois à éclairer toute une nuit",
  ],
  [
    "🌊",
    "La rivière",
    "se laisser porter un instant",
    "découvrit que lâcher prise n’est pas abandonner, mais changer de rythme",
  ],
  [
    "🧵",
    "Le fil",
    "tirer doucement un fil",
    "apprit qu’une histoire se détisse et se retisse sans jamais tout perdre",
  ],
  [
    "🏮",
    "La lanterne",
    "éclairer deux pas devant soi",
    "comprit qu’on n’a pas besoin de voir tout le chemin pour avancer",
  ],
  [
    "🍯",
    "Le miel",
    "goûter ce qui est doux",
    "découvrit qu’une douceur minuscule peut tenir tête à beaucoup d’amertume",
  ],
];

export { TY, EM, NE, BU };
