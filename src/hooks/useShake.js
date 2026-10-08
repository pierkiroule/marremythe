import { useEffect, useRef, useState } from "react";
import { createShakeDetector } from "../domain/shake.js";
export function useShake(onShake, active) {
  const [status, setStatus] = useState("idle");
  const [listening, setListening] = useState(false);
  const callback = useRef(onShake);
  callback.current = onShake;
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function enable() {
    if (!window.isSecureContext) {
      setStatus("insecure");
      return;
    }
    const Motion = window.DeviceMotionEvent;
    if (!Motion) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    try {
      // iOS requires this call directly from an explicit button gesture.
      const permission =
        typeof Motion.requestPermission === "function"
          ? await Motion.requestPermission()
          : "granted";
      if (!mounted.current) return;
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }
      setStatus("enabled");
      setListening(true);
    } catch {
      if (mounted.current) setStatus("denied");
    }
  }
  useEffect(() => {
    if (!listening || !active) return;
    const detector = createShakeDetector();
    let received = false;
    const timer = setTimeout(() => {
      if (!received) setStatus("silent");
    }, 4000);
    const handle = (event) => {
      if (document.hidden) return;
      const clean = event.acceleration;
      const vector =
        clean && [clean.x, clean.y, clean.z].every(Number.isFinite)
          ? clean
          : event.accelerationIncludingGravity;
      if (!vector || ![vector.x, vector.y, vector.z].every(Number.isFinite))
        return;
      if (!received) {
        received = true;
        setStatus("enabled");
        clearTimeout(timer);
      }
      if (detector(vector, performance.now())) callback.current();
    };
    window.addEventListener("devicemotion", handle);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("devicemotion", handle);
    };
  }, [listening, active]);
  return { status, enable };
}
