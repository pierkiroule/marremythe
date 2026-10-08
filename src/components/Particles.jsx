import { useEffect, useRef } from "react";
const colors = [
  "#ffd27a",
  "#ff9a5a",
  "#bda9ff",
  "#78e6df",
  "#fff2cc",
  "#ff86ae",
];
export default function Particles({ intensity }) {
  const ref = useRef(null);
  const level = useRef(intensity);
  level.current = intensity;
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let particles = [],
      frame,
      previous = 0,
      width,
      height,
      ambient = 0;
    let budget = matchMedia("(pointer: coarse)").matches ? 650 : 1100;
    function resize() {
      width = innerWidth;
      height = innerHeight;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    function emit({ x, y, count, kind }) {
      if (preference.matches || document.hidden) return;
      const amount = Math.min(count, budget - particles.length);
      for (let i = 0; i < amount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed =
          kind === "trail" ? 1 + Math.random() * 2 : 2 + Math.random() * 8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (kind === "confetti" ? 6 : 0),
          life: 0,
          max: kind === "confetti" ? 1600 : 700 + Math.random() * 700,
          size: 2 + Math.random() * 4,
          color: colors[i % colors.length],
          kind,
          spin: Math.random() * 6,
        });
      }
    }
    const event = (e) => emit(e.detail);
    const tap = (e) => {
      if (e.target.closest("button:not(:disabled)"))
        emit({ x: e.clientX, y: e.clientY, count: 28, kind: "spark" });
    };
    function tick(time) {
      const delta = Math.min(34, time - (previous || time));
      previous = time;
      if (delta > 30 && particles.length > 450)
        budget = Math.max(450, budget - 5);
      context.clearRect(0, 0, width, height);
      ambient += (delta * level.current) / 18;
      if (ambient >= 1) {
        emit({
          x: Math.random() * width,
          y: height + 8,
          count: Math.floor(ambient),
          kind: "bubble",
        });
        ambient %= 1;
      }
      particles = particles.filter((p) => p.life < p.max);
      context.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.life += delta;
        const d = delta / 16.67;
        p.x += p.vx * d;
        p.y += p.vy * d;
        if (p.kind === "bubble") {
          p.vy = -1.5;
          p.vx *= 0.97;
        } else p.vy += (p.kind === "confetti" ? 0.12 : 0.04) * d;
        p.vx *= Math.pow(0.98, d);
        const alpha = Math.max(0, 1 - p.life / p.max);
        context.globalAlpha = alpha * 0.8;
        context.fillStyle = p.color;
        context.strokeStyle = p.color;
        if (p.kind === "confetti") {
          context.save();
          context.translate(p.x, p.y);
          context.rotate(p.spin + p.life * 0.005);
          context.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
          context.restore();
        } else {
          context.beginPath();
          context.arc(p.x, p.y, p.size * (0.3 + alpha), 0, Math.PI * 2);
          if (p.kind === "bubble") context.stroke();
          else context.fill();
          if (p.kind === "spark") {
            context.globalAlpha = alpha * 0.13;
            context.beginPath();
            context.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            context.fill();
          }
        }
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    }
    function visibility() {
      cancelAnimationFrame(frame);
      previous = 0;
      particles = [];
      context.clearRect(0, 0, width, height);
      if (!document.hidden && !preference.matches)
        frame = requestAnimationFrame(tick);
    }
    resize();
    visibility();
    window.addEventListener("resize", resize);
    window.addEventListener("marremythe:particles", event);
    window.addEventListener("pointerdown", tap);
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", visibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("marremythe:particles", event);
      window.removeEventListener("pointerdown", tap);
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", visibility);
    };
  }, []);
  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
