import { useEffect, useRef, useState } from "react";
import {
  bubbleIndex,
  collectionKey,
  encodeCollection,
  parseCollection,
} from "../domain/bubbles.js";
export function useResourceCollection() {
  const [ids, setIds] = useState(() => {
    try {
      return parseCollection(localStorage.getItem(collectionKey));
    } catch {
      return [];
    }
  });
  const [temporary, setTemporary] = useState(false);
  const last = useRef(encodeCollection(ids));
  useEffect(() => {
    const encoded = encodeCollection(ids);
    if (encoded === last.current) return;
    last.current = encoded;
    try {
      localStorage.setItem(collectionKey, encoded);
      setTemporary(false);
    } catch {
      setTemporary(true);
    }
  }, [ids]);
  useEffect(() => {
    const sync = (event) => {
      if (event.key !== collectionKey) return;
      const next = parseCollection(event.newValue);
      last.current = encodeCollection(next);
      setIds(next);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return {
    ids,
    temporary,
    has: (id) => ids.includes(id),
    keep: (id) => {
      if (bubbleIndex.has(id))
        setIds((previous) =>
          previous.includes(id) ? previous : [...previous, id],
        );
    },
    remove: (id) =>
      setIds((previous) => previous.filter((value) => value !== id)),
  };
}
