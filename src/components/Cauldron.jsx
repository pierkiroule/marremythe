import { useRef } from "react";
import { ingredients } from "../domain/journey.js";
export default function Cauldron({ state, dispatch }) {
  const pointer = useRef(null);
  const items = ingredients(state);
  const ready = state.thrown.length === items.length;
  const done = state.heat >= 100;
  const stir = () => dispatch({ type: "stir", now: performance.now() });
  const stop = () => {
    pointer.current = null;
  };
  return (
    <>
      <div
        className="scene"
        style={{ "--h": state.heat / 100 }}
        onPointerDown={(event) => {
          if (!ready || done || event.target.closest("button")) return;
          pointer.current = { x: event.clientX, y: event.clientY, distance: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const last = pointer.current;
          if (!last) return;
          const distance =
            last.distance +
            Math.hypot(event.clientX - last.x, event.clientY - last.y);
          pointer.current = {
            x: event.clientX,
            y: event.clientY,
            distance: distance % 45,
          };
          if (distance >= 45) stir();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
      >
        <div className="glow" aria-hidden="true" />
        <div className="logs" aria-hidden="true">
          🪵🪵
        </div>
        <div className={`cauldron ${done ? "done" : ""}`} aria-hidden="true">
          <div className="handle l" />
          <div className="handle r" />
          <div className="potbody">
            <span>
              MARRE
              <br />
              MYTHE
            </span>
          </div>
          <div className="rim">
            <div
              className="liquid"
              style={{ animationDuration: `${5 - state.heat / 25}s` }}
            />
          </div>
          <i className="leg a" />
          <i className="leg b" />
        </div>
        {items.map((item, index) => {
          const angle = Math.PI * (1 - (index + 0.5) / items.length);
          return (
            <button
              key={item.id}
              className={`ing ${state.thrown.includes(item.id) ? "gone" : ""}`}
              aria-label={`Jeter : ${item.label}`}
              style={{
                left: `calc(${50 + 39 * Math.cos(angle)}% - 24px)`,
                top: `${33 - 22 * Math.sin(angle)}%`,
                "--d": `${-index * 0.45}s`,
              }}
              disabled={state.thrown.includes(item.id)}
              onClick={() => dispatch({ type: "throw", id: item.id })}
            >
              {item.emoji}
            </button>
          );
        })}
        {done && <div className="cooked">✨ À point !</div>}
      </div>
      <progress
        className="cooking-progress"
        value={state.heat}
        max={100}
        aria-label="Progression de la cuisson"
      />
      <p className="center hint" role="status">
        {!ready
          ? `${state.thrown.length} / ${items.length} ingrédients dans la marmite`
          : done
            ? "La marmite déborde de possibles."
            : `Remue avec ton doigt ou le bouton · ${state.heat} %`}
      </p>
      {!ready ? (
        <button className="mini" onClick={() => dispatch({ type: "throwAll" })}>
          🍲 Tout jeter d’un coup
        </button>
      ) : (
        <button className="mini stir" disabled={done} onClick={stir}>
          🥄 Remuer la marmite
        </button>
      )}
    </>
  );
}
