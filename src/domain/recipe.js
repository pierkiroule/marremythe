import { TY, EM, NE, BU } from "./catalog.js";
import { readHistory, saveHistory } from "./history.js";
const rnd = (a) => a[Math.floor(Math.random() * a.length)],
  cap = (s) => s[0].toUpperCase() + s.slice(1),
  lc = (s) => s[0].toLowerCase() + s.slice(1),
  J = (a) =>
    a.length > 1 ? a.slice(0, -1).join(", ") + " et " + a[a.length - 1] : a[0];
function pick(key, choices) {
  const history = readHistory();
  const used = history[key] || [];
  let available = choices
    .map((_, index) => index)
    .filter((index) => !used.includes(index));
  if (!available.length) {
    used.length = 0;
    available = choices.map((_, index) => index);
  }
  const index = rnd(available);
  history[key] = [...used, index];
  saveHistory(history);
  return choices[index];
}
const PR = [
  ["Aëlis", "cartographe des brumes", "f"],
  ["Maëlo", "gardien des passages", "m"],
  ["Sorha", "voyageuse sans carte", "f"],
  ["Ilan", "jardinier des ombres", "m"],
  ["Yseult", "chercheuse d’étoiles", "f"],
  ["Tomás", "forgeron de silences", "m"],
  ["Livia", "tisseuse de vents", "f"],
  ["Eliott", "apprenti sourcier", "m"],
  ["Nour", "cuisinière de tempêtes", "f"],
  ["Kaï", "veilleur de phares", "m"],
  ["Mélisande", "archiviste d’échos", "f"],
  ["Oren", "messager sans adresse", "m"],
  ["Célestin", "pâtissier de nuages", "m"],
  ["Zoé", "apprentie alchimiste", "f"],
];
const AL = [
  "un renard bavard",
  "une louche enchantée",
  "un vieux chaudron qui chantonne",
  "une aubergiste aux mains de farine",
  "un corbeau cartographe",
  "une petite flamme têtue",
  "un enfant qui pose des questions",
  "un chat qui connaît tous les raccourcis",
  "une grand-mère de vapeur",
  "un colporteur d’épices",
];
const INTRO = [
  (N, r, s) =>
    `Il était une fois ${N}, ${r}. Dans son pays, chaque jour semblait répéter la même phrase : « ${s} ».`,
  (N, r, s) =>
    `${N}, ${r}, avait appris à vivre avec une idée fixe : « ${s} ». Ce n’était pas une fatalité, seulement le décor.`,
  (N, r, s) =>
    `Au commencement, il y avait ${N}, ${r}, et une casserole vide. Dans le silence de la cuisine résonnait un refrain : « ${s} ».`,
  (N, r, s) =>
    `On racontait que ${N}, ${r}, portait avec soi un pays entier où l’on murmurait : « ${s} ».`,
];
const TRIAL = [
  (c) =>
    `Dans le grand chaudron de la nuit, ${c.N} jeta ${c.E} d’un seul geste. Le bouillon devint ${c.IM}. ${cap(c.A)} approcha et murmura : « Ce qui mijote n’est pas toi. C’est seulement ce que tu traverses. »`,
  (c) =>
    `${c.N} souleva le couvercle et y laissa tomber ${c.E}. Il y eut un grand PLOP, puis le bouillon devint ${c.IM}. ${cap(c.A)} chuchota : « Ne jette rien d’autre. Goûte d’abord. »`,
  (c) =>
    `Au fond de la cuisine du monde, ${c.N} versa ${c.E} dans la marmite. Le liquide devint ${c.IM}, et une question monta avec la vapeur : comment retrouver ${c.n} sans renier ce qui avait été vécu ?`,
  (c) =>
    `La marmite se mit à gronder quand ${c.N} y plongea ${c.E}. Tout devint ${c.IM}. ${cap(c.A)} resta là, avec patience, comme on reste près d’un plat qui a besoin de temps.`,
];
const CHANGE = [
  (c) =>
    `Alors, d’entre les bulles, surgit ${c.b}. ${c.N} osa ${c.B[2]} et ${c.B[3]}. On ajouta ${c.herb}, et la saveur du bouillon changea.`,
  (c) =>
    `Une bulle plus claire que les autres remonta : c’était ${c.b}. En osant ${c.B[2]}, ${c.N} ${c.B[3]}. ${cap(c.herb)} tomba dans la marmite comme par hasard.`,
  (c) =>
    `${c.N} goûta le bouillon du bout de la louche. Il y avait là ${c.b}, et cela suffit : ${c.P} osa ${c.B[2]} et ${c.B[3]}. Quelqu’un, sans bruit, avait glissé ${c.herb} dans la marmite.`,
];
const NUA = [
  "Ce n’était pas une victoire définitive, mais un changement de regard.",
  "Rien n’était résolu, et pourtant le goût n’était plus tout à fait le même.",
  "La marmite n’avait rien effacé : elle avait transformé ce qu’elle contenait.",
  "Le plat n’était pas fini, mais il avait désormais une odeur de possible.",
  "Ce fut moins un exploit qu’un assaisonnement : discret, et décisif.",
];
const QUEST = [
  (c) =>
    `Au matin, une quête nouvelle commença : trouver un geste minuscule qui ferait un peu plus de place pour ${c.n}. Le reste du mythe restait à inventer.`,
  (c) =>
    `Quand la vapeur retomba, ${c.N} comprit qu’il restait du bouillon pour plus tard. Prochaine étape : laisser ${c.n} s’inviter à table, ne serait-ce que le temps d’un repas.`,
  (c) =>
    `${c.N} referma le couvercle, sans hâte. Demain, ${c.P} chercherait ${c.n}, non pas comme un trésor lointain, mais comme un ingrédient à portée de main.`,
  (c) =>
    `Et la marmite resta sur le feu doux : une promesse tranquille de chercher ${c.n}, un pas après l’autre, une cuillerée après l’autre.`,
  (c) =>
    `Sur le rebord de la fenêtre, ${c.N} laissa refroidir ce qui restait. La suite se cuisinerait demain, avec ${c.n} en ingrédient principal.`,
];
const TITLES = [
  (c) => `${cap(c.b)} ${c.tail}`,
  (c) => `${c.N} et ${c.b}`,
  (c) => `${c.N}, ${c.b} et la marmite`,
  (c) => `${c.N} à la marmite`,
  (c) => `Chronique ${c.tail}`,
];
export function generateRecipe(st) {
  const o = st.other,
    pr = pick("pr", PR),
    N = pr[0],
    P = pr[2] === "f" ? "elle" : "il",
    B = BU[st.bubble ?? 0],
    ti = st.type.length ? st.type : [10];
  const subs = ti.map((i) =>
    i === 10 ? o.type.trim() || TY[10][2] : TY[i][2],
  );
  const em = st.emotion.map((i) =>
    i === 8
      ? {
          t: o.emotion.trim()
            ? "« " + o.emotion.trim() + " »"
            : "ce qu’aucun mot ne disait",
          im: [
            "d’une couleur que personne n’avait encore nommée",
            "étrange, sans nom, et pourtant familier",
          ],
        }
      : { t: "sa " + EM[i][1].toLowerCase(), im: EM[i][2] },
  );
  const nd = st.need.length ? st.need : [8],
    ne = nd.map((i) => ({
      n: i === 8 && o.need.trim() ? o.need.trim() : NE[i][2],
      h: NE[i][3],
      g: NE[i][4],
      i,
    }));
  const c = {
    N,
    P,
    B,
    b: lc(B[1]),
    A: pick("al", AL),
    n: J(ne.map((x) => x.n)),
    herb: ne[0].h,
    E: J(em.map((e) => e.t)) || "tout ce qui pesait",
    IM:
      J(em.map((e, k) => pick("im" + st.emotion[k], e.im))) ||
      "d’une couleur étrange",
    tail: TY[rnd(ti)][3],
  };
  const worlds = ti.map((i, k) => {
    const w = pick("w" + i, TY[i][4]);
    return k
      ? (k === 1 ? "Plus loin, " : "Et comme si cela ne suffisait pas, ") +
          lc(w)
      : w;
  });
  const sections = [
    [
      "🧺",
      "Les ingrédients",
      pick("in", INTRO)(N, pr[1], subs.join(" / ")) + " " + worlds.join(" "),
    ],
    ["🔥", "La cuisson", pick("tr", TRIAL)(c)],
    ["🌿", "L’assaisonnement", pick("ch", CHANGE)(c) + " " + pick("nu", NUA)],
    ["🍽️", "À déguster", pick("qu", QUEST)(c)],
  ];
  const chef =
    "Une idée à goûter : " +
    ne
      .slice(0, 2)
      .map(
        (x, k) =>
          (k ? "et, si tu as un peu de temps, " : "") + pick("g" + x.i, x.g),
      )
      .join(" ") +
    ".";
  const et = rnd(ti),
    echo = pick("e" + et, TY[et][5]),
    title = pick(
      "ti" + ti.join(),
      ti.flatMap((i) => TITLES.map((f) => f({ ...c, tail: TY[i][3] }))),
    );
  const text =
    `${title}\n\n` +
    sections.map((s) => `${s[1]}\n${s[2]}`).join("\n\n") +
    `\n\nLe conseil du chef\n${chef}\n\nÉcho culturel : ${echo[0]} — ${echo[1]}.`;
  return { title, sections, chef, echo, emoji: B[0], text };
}
