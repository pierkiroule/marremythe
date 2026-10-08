import { useEffect, useRef } from "react";
import { sparkle, soundEffect } from "../effects/particles.js";

const colors = ["#c5b4ff", "#78e6df", "#ffd27a", "#ff9ebf", "#96c7ff"];

export default function Welcome({ onStart }) {
  const source = useRef(null);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    function burst() {
      if (document.hidden || preference.matches) return;
      const box = source.current?.getBoundingClientRect();
      if (box) sparkle(box.left + box.width / 2, box.top, 65, "confetti");
    }
    const entrance = setTimeout(burst, 700);
    const bubbles = setInterval(burst, 3200);
    return () => {
      clearTimeout(entrance);
      clearInterval(bubbles);
    };
  }, []);

  function start(event) {
    const box = event.currentTarget.getBoundingClientRect();
    sparkle(box.left + box.width / 2, box.top, 180, "confetti");
    soundEffect("finish");
    onStart();
  }

  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="welcome-theatre">
        <div className="fairy-kitchen" aria-hidden="true">
          <div className="kitchen-arch" />
          <div className="kitchen-window">
            <span>☾</span>
          </div>
          <div className="kitchen-shelf shelf-left">
            <span className="potion potion-lilac">✦</span>
            <span className="potion potion-mint">❋</span>
            <span className="potion potion-gold">☀</span>
          </div>
          <div className="kitchen-shelf shelf-right">
            <span className="kitchen-book">☽</span>
            <span className="kitchen-book">✧</span>
            <span className="potion potion-pink">♡</span>
          </div>
          <span className="hanging-herbs">
            ✿<br />❧
          </span>
          <span className="hanging-spoon">🥄</span>
          <div className="kitchen-counter" />
          <div className="welcome-halo" />
          <div className="welcome-steam">
            <i />
            <i />
            <i />
          </div>
          <div className="welcome-bubbles">
            {Array.from({ length: 28 }, (_, i) => (
              <i
                key={i}
                className="welcome-bubble"
                style={{
                  "--bubble-color": colors[i % colors.length],
                  "--size": `${14 + ((i * 13) % 40)}px`,
                  "--drift": `${((i * 73) % 480) - 240}px`,
                  "--delay": `${-((i * 0.43) % 6)}s`,
                  "--duration": `${4.5 + (i % 5) * 0.4}s`,
                }}
              />
            ))}
          </div>
          <div className="welcome-pot" ref={source}>
            <svg viewBox="0 0 320 230" fill="none">
              <defs>
                <linearGradient
                  id="welcome-metal"
                  x1="70"
                  y1="60"
                  x2="260"
                  y2="210"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7b619e" />
                  <stop offset=".38" stopColor="#302843" />
                  <stop offset="1" stopColor="#171325" />
                </linearGradient>
                <linearGradient id="welcome-soup">
                  <stop stopColor="#8cffdd" />
                  <stop offset=".5" stopColor="#d5b4ff" />
                  <stop offset="1" stopColor="#ffb7dc" />
                </linearGradient>
                <radialGradient id="welcome-fire">
                  <stop stopColor="#fff2ae" />
                  <stop offset=".5" stopColor="#ffc067" />
                  <stop offset="1" stopColor="#ef6588" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse
                className="welcome-fire"
                cx="160"
                cy="203"
                rx="110"
                ry="25"
                fill="url(#welcome-fire)"
              />
              <path
                d="M92 169 76 209M228 169l16 40"
                stroke="#463550"
                strokeWidth="17"
                strokeLinecap="round"
              />
              <path
                d="M65 88C7 56 9 129 64 125M255 88c58-32 56 41 1 37"
                stroke="#a18bb1"
                strokeWidth="11"
              />
              <path
                d="M62 72c-30 102 15 119 98 122 83-3 128-20 98-122Z"
                fill="url(#welcome-metal)"
                stroke="#af91c4"
                strokeWidth="2"
              />
              <path
                d="M83 95c-10 36-4 58 12 70"
                stroke="#e1c4ff"
                strokeOpacity=".2"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <ellipse
                cx="160"
                cy="72"
                rx="101"
                ry="27"
                fill="#342742"
                stroke="#cfb1de"
                strokeWidth="7"
              />
              <ellipse
                className="welcome-soup"
                cx="160"
                cy="72"
                rx="91"
                ry="20"
                fill="url(#welcome-soup)"
              />
              <ellipse
                cx="132"
                cy="68"
                rx="48"
                ry="8"
                stroke="white"
                strokeOpacity=".5"
                strokeWidth="2"
              />
              <circle cx="186" cy="73" r="6" fill="white" fillOpacity=".6" />
              <circle cx="113" cy="77" r="4" fill="white" fillOpacity=".7" />
              <path
                d="m160 115 6 15 16 6-16 6-6 16-6-16-16-6 16-6Z"
                fill="#ffd27a"
              />
              <path
                d="m118 128 3 6 6 3-6 3-3 6-3-6-6-3 6-3Zm88 19 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"
                fill="#c5b4ff"
              />
            </svg>
          </div>
          <span className="kitchen-spark spark-one">✧</span>
          <span className="kitchen-spark spark-two">✦</span>
          <span className="kitchen-spark spark-three">✧</span>
        </div>
        <div className="welcome-title-wrap">
          <p className="welcome-eyebrow">
            Jette tes colères, découvre ce qui compte
          </p>
          <h1 id="welcome-title">
            Mar<span>mythe</span>
            <sup aria-hidden="true">✧</sup>
          </h1>
          <p className="welcome-subtitle">La Marmythe à colère.</p>
        </div>
      </div>
      <div className="welcome-invitation">
        <h2>J’en ai marre. À la marmythe !</h2>
        <p>Bienvenue ! Choisis tes colères et jette-les dans la marmythe.</p>
        <p className="welcome-promise">
          Du mélange émerge ton bouillon de valeurs : un mythe qui résonne, des
          idées à garder et ton histoire à inventer.
        </p>
        <button className="btn welcome-start" onClick={start}>
          Je jette mes colères ! <span aria-hidden="true">✦</span>
        </button>
        <p className="welcome-footnote">
          À ton rythme · Sans compte · Tes réponses restent pour toi
        </p>
      </div>
    </section>
  );
}
