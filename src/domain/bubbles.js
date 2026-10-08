import { mythCatalog } from "./matching.js";
export function storyBubbles(myth) {
  const parts = [
    {
      key: "story",
      kind: "story",
      label: "L’histoire",
      emoji: myth.emoji,
      color: "violet",
      text: myth.summary,
    },
    {
      key: "resource",
      kind: "resource",
      label: "Ce qui peut aider",
      emoji: "🌿",
      color: "mint",
      text: myth.resource,
    },
    {
      key: "idea",
      kind: "idea",
      label: "Une idée à garder",
      emoji: "✨",
      color: "gold",
      text: myth.nourishment,
    },
    ...myth.questions.map((question, index) => ({
      key: `question-${question.id}`,
      kind: "question",
      label: ["Ce qui te pèse", "Tes appuis", "Un petit pas"][index],
      emoji: ["💭", "🤝", "👣"][index],
      color: ["pink", "blue", "peach"][index],
      text: question.prompt,
      questionId: question.id,
    })),
  ];
  return parts.map((part) => ({
    ...part,
    id: `${myth.id}:${part.key}`,
    mythId: myth.id,
    mythTitle: myth.title,
    tradition: myth.tradition,
  }));
}
export const bubbleIndex = new Map(
  mythCatalog.flatMap(storyBubbles).map((bubble) => [bubble.id, bubble]),
);
export const collectionKey = "marremythe.resource-bubbles.v1";
export function parseCollection(raw) {
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.ids)) return [];
    return [
      ...new Set(
        data.ids.filter((id) => typeof id === "string" && bubbleIndex.has(id)),
      ),
    ].slice(0, bubbleIndex.size);
  } catch {
    return [];
  }
}
export function encodeCollection(ids) {
  return JSON.stringify({
    version: 1,
    ids: [...new Set(ids)].filter((id) => bubbleIndex.has(id)),
  });
}
