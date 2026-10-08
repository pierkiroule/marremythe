import { useEffect, useRef, useState } from "react";
import { RetroMusic } from "../audio/RetroMusic.js";
export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const engine = useRef(null),
    wanted = useRef(false),
    mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    const effect = (e) => engine.current?.effect(e.detail);
    const visibility = () => {
      if (document.hidden) engine.current?.pause();
      else if (wanted.current)
        engine.current?.start().catch(() => {
          wanted.current = false;
          if (mounted.current) {
            setEnabled(false);
            setError("Son indisponible.");
          }
        });
    };
    window.addEventListener("marremythe:sound", effect);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      mounted.current = false;
      wanted.current = false;
      engine.current?.dispose();
      engine.current = null;
      window.removeEventListener("marremythe:sound", effect);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  async function toggle() {
    setBusy(true);
    setError("");
    try {
      if (enabled) {
        wanted.current = false;
        await engine.current.pause();
        if (mounted.current) setEnabled(false);
      } else {
        engine.current ||= new RetroMusic();
        await engine.current.start();
        if (mounted.current) {
          wanted.current = true;
          setEnabled(true);
        }
      }
    } catch {
      if (mounted.current) setError("Son indisponible dans ce navigateur.");
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  return (
    <div className="sound-control">
      <button
        className="sound-toggle"
        aria-pressed={enabled}
        aria-label={enabled ? "Couper la musique" : "Activer la musique rétro"}
        disabled={busy}
        onClick={toggle}
      >
        {enabled ? "♫ Son activé" : "♪ Activer le son"}
      </button>
      <span className="sr-only" role="status">
        {error}
      </span>
    </div>
  );
}
