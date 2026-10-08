import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ingredients } from "../domain/journey.js";
import { useShake } from "../hooks/useShake.js";
import { sparkle, soundEffect } from "../effects/particles.js";
const messages = {
  denied: "Accès refusé. Tu peux mélanger avec le bouton.",
  unsupported: "Ce navigateur ne propose pas les capteurs. Utilise le bouton.",
  insecure:
    "Le secouement demande une connexion HTTPS. Le bouton reste disponible.",
  silent: "Aucun mouvement reçu. Essaie de secouer, ou utilise le bouton.",
  requesting: "Autorise le mouvement sur ton téléphone…",
};
export default function Cauldron({ state, dispatch }) {
  const [drag, setDrag] = useState(null),
    [flights, setFlights] = useState([]);
  const pot = useRef(null),
    timers = useRef(new Set()),
    pending = useRef(new Set()),
    lastTrail = useRef(0);
  const items = ingredients(state),
    ready = state.thrown.length === items.length,
    done = state.heat >= 100;
  const touch =
    matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  const center = () => {
    const rect = pot.current?.getBoundingClientRect();
    return rect
      ? { x: rect.left + rect.width / 2, y: rect.top + 55 }
      : { x: innerWidth / 2, y: innerHeight / 2 };
  };
  function mix() {
    if (!ready || done) return;
    const { x, y } = center();
    sparkle(x, y, 90);
    soundEffect("mix");
    dispatch({ type: "stir", now: performance.now() });
  }
  const motion = useShake(mix, ready && !done);
  useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer);
    },
    [],
  );
  useEffect(() => {
    if (!done) return;
    const { x, y } = center();
    sparkle(x, y, 450, "confetti");
    soundEffect("finish");
    const timer = setTimeout(() => dispatch({ type: "next" }), 1100);
    timers.current.add(timer);
    return () => {
      clearTimeout(timer);
      timers.current.delete(timer);
    };
  }, [done, dispatch]);
  function drop(item, x, y) {
    if (pending.current.has(item.id) || state.thrown.includes(item.id)) return;
    const dest = center();
    pending.current.add(item.id);
    setFlights((f) => [
      ...f,
      { ...item, x, y, dx: dest.x - x, dy: dest.y - y },
    ]);
    const timer = setTimeout(() => {
      dispatch({ type: "throw", id: item.id });
      pending.current.delete(item.id);
      setFlights((f) => f.filter((i) => i.id !== item.id));
      sparkle(dest.x, dest.y, 160);
      soundEffect("drop");
      timers.current.delete(timer);
    }, 450);
    timers.current.add(timer);
  }
  return (
    <>
      <div
        className={`scene ${drag ? "is-dragging" : ""} ${done ? "is-cooked" : ""}`}
        style={{ "--h": state.heat / 100 }}
      >
        <div className="glow" aria-hidden="true" />
        <div className="logs" aria-hidden="true">
          🪵🔥🪵
        </div>
        <div
          ref={pot}
          className={`cauldron ${ready ? "mixing" : ""} ${done ? "done" : ""}`}
          aria-hidden="true"
        >
          <div className="handle l" />
          <div className="handle r" />
          <div className="potbody">
            <span>
              MAR
              <br />
              MYTHE
            </span>
          </div>
          <div className="rim">
            <div
              className="liquid"
              style={{ animationDuration: `${5 - state.heat / 25}s` }}
            />
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} className="soup-bubble" style={{ "--i": i }} />
            ))}
          </div>
          <i className="leg a" />
          <i className="leg b" />
        </div>
        <div className="ingredient-tray" aria-label="Ingrédients à glisser">
          {items.map((item) => (
            <button
              key={item.id}
              className={`ingredient ${state.thrown.includes(item.id) || pending.current.has(item.id) ? "dropped" : ""} ${drag?.id === item.id ? "dragging" : ""}`}
              aria-label={`Glisser ${item.label} dans la marmite`}
              aria-describedby="drag-hint"
              disabled={
                state.thrown.includes(item.id) || pending.current.has(item.id)
              }
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                setDrag({
                  id: item.id,
                  x: event.clientX,
                  y: event.clientY,
                  startX: event.clientX,
                  startY: event.clientY,
                });
              }}
              onPointerMove={(event) => {
                if (drag?.id !== item.id) return;
                setDrag({ ...drag, x: event.clientX, y: event.clientY });
                if (performance.now() - lastTrail.current > 24) {
                  sparkle(event.clientX, event.clientY, 8, "trail");
                  lastTrail.current = performance.now();
                }
              }}
              onPointerUp={(event) => {
                if (drag?.id !== item.id) return;
                const rect = pot.current.getBoundingClientRect();
                if (
                  event.clientX >= rect.left - 15 &&
                  event.clientX <= rect.right + 15 &&
                  event.clientY >= rect.top &&
                  event.clientY <= rect.bottom
                )
                  drop(item, event.clientX, event.clientY);
                setDrag(null);
              }}
              onPointerCancel={() => setDrag(null)}
              onLostPointerCapture={() => setDrag(null)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  const rect = event.currentTarget.getBoundingClientRect();
                  drop(
                    item,
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                  );
                }
              }}
            >
              <span
                aria-hidden="true"
                style={
                  drag?.id === item.id
                    ? {
                        transform: `translate(${drag.x - drag.startX}px,${drag.y - drag.startY}px) scale(1.3)`,
                      }
                    : undefined
                }
              >
                {item.emoji}
              </span>
              <small>{item.label}</small>
            </button>
          ))}
        </div>
        {flights.map((item) =>
          createPortal(
            <span
              key={item.id}
              className="flying-ingredient"
              aria-hidden="true"
              style={{
                left: item.x,
                top: item.y,
                "--dx": `${item.dx}px`,
                "--dy": `${item.dy}px`,
              }}
            >
              {item.emoji}
            </span>,
            document.body,
            item.id,
          ),
        )}
        {done && <div className="cooked">✨ Ça mijote !</div>}
      </div>
      <p id="drag-hint" className="cooking-hint" role="status">
        {!ready
          ? `Jette tes ingrédients · ${state.thrown.length}/${items.length}`
          : done
            ? "Ton bouillon se clarifie…"
            : touch
              ? "Secoue ton tel !"
              : "Mélange pour découvrir ton récit."}
      </p>
      {!ready ? (
        <p className="hint keyboard-hint">
          Au clavier : Entrée sur un ingrédient pour le jeter.
        </p>
      ) : (
        <>
          <progress
            className="cooking-progress"
            value={state.heat}
            max={100}
            aria-label="Progression du mélange"
          />
          {!done && (
            <div className="mix-controls">
              {touch &&
                motion.status !== "enabled" &&
                motion.status !== "silent" && (
                  <button
                    className="btn motion-button"
                    disabled={motion.status === "requesting"}
                    onClick={motion.enable}
                  >
                    📱 Activer le secouement
                  </button>
                )}
              {touch && motion.status === "enabled" && (
                <div className="shake-prompt" aria-hidden="true">
                  📱
                </div>
              )}
              <button className={touch ? "text-button" : "btn"} onClick={mix}>
                {touch ? "Mélanger sans secouer" : "🥄 Mélanger"}
              </button>
              {messages[motion.status] && (
                <p className="hint" role="status">
                  {messages[motion.status]}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
