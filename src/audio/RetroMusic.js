// Original, generative chiptune: four harmonic sections, two countermelodies,
// arpeggios, walking bass and synthesised percussion. No recordings/assets.
export class RetroMusic {
  constructor() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) throw new Error("Audio indisponible");
    this.context = new Context();
    this.master = this.context.createGain();
    this.master.gain.value = 0.18;
    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.ratio.value = 5;
    this.master.connect(compressor);
    compressor.connect(this.context.destination);
    this.nodes = new Set();
    this.step = 0;
    this.timer = null;
    const buffer = this.context.createBuffer(
      1,
      this.context.sampleRate * 0.12,
      this.context.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    this.noise = buffer;
  }
  tone(note, time, duration = 0.12, type = "square", volume = 0.1) {
    const osc = this.context.createOscillator(),
      gain = this.context.createGain();
    osc.type = type;
    osc.frequency.value = 440 * 2 ** ((note - 69) / 12);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(time);
    osc.stop(time + duration + 0.02);
    this.nodes.add(osc);
    osc.onended = () => {
      this.nodes.delete(osc);
      osc.disconnect();
      gain.disconnect();
    };
  }
  drum(time, snare) {
    if (!snare) {
      const osc = this.context.createOscillator(),
        gain = this.context.createGain();
      osc.frequency.setValueAtTime(130, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + 0.1);
      gain.gain.setValueAtTime(0.28, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.13);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(time);
      osc.stop(time + 0.14);
      this.nodes.add(osc);
      osc.onended = () => {
        this.nodes.delete(osc);
        osc.disconnect();
        gain.disconnect();
      };
      return;
    }
    const noise = this.context.createBufferSource(),
      filter = this.context.createBiquadFilter(),
      gain = this.context.createGain();
    noise.buffer = this.noise;
    filter.type = "highpass";
    filter.frequency.value = 2200;
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    noise.start(time);
    this.nodes.add(noise);
    noise.onended = () => {
      this.nodes.delete(noise);
      noise.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }
  schedule() {
    const chords = [
      [60, 64, 67, 71],
      [57, 60, 64, 67],
      [53, 57, 60, 64],
      [55, 59, 62, 65],
      [60, 64, 67, 72],
      [62, 65, 69, 72],
      [53, 57, 60, 64],
      [55, 59, 62, 67],
    ];
    const motifs = [
      [0, 2, 1, 3, 2, 1, 0, 1],
      [2, 3, 2, 1, 0, 1, 2, 3],
      [1, 0, 2, 1, 3, 2, 1, 0],
      [3, 2, 1, 2, 0, 1, 2, 3],
    ];
    while (this.next < this.context.currentTime + 0.16) {
      const step = this.step++,
        beat = step % 16,
        bar = Math.floor(step / 16),
        section = Math.floor(bar / 8) % 4;
      const chord = chords[bar % 8],
        time = this.next,
        unit = 60 / 116 / 4;
      this.tone(chord[beat % 4] + 12, time, 0.09, "triangle", 0.07);
      if (beat % 2 === 0) {
        const index = motifs[section][beat / 2];
        this.tone(
          chord[index] + 12 + (section === 3 && beat >= 8 ? 12 : 0),
          time,
          unit * 1.6,
          "square",
          0.075,
        );
      }
      if (beat % 4 === 0)
        this.tone(chord[beat === 8 ? 2 : 0] - 24, time, 0.27, "triangle", 0.26);
      if (section > 0 && beat % 4 === 2)
        this.tone(chord[(beat / 2 + bar) % 4], time, 0.22, "sine", 0.1);
      if (beat % 8 === 0) this.drum(time, false);
      if (beat % 8 === 4) this.drum(time, true);
      this.next += unit * (beat % 2 === 0 ? 1.06 : 0.94);
    }
  }
  async start() {
    clearInterval(this.timer);
    await this.context.resume();
    if (this.context.state !== "running") throw new Error("Audio bloqué");
    this.next = this.context.currentTime + 0.03;
    this.schedule();
    this.timer = setInterval(() => this.schedule(), 40);
  }
  pause() {
    clearInterval(this.timer);
    this.timer = null;
    for (const node of this.nodes) {
      try {
        node.stop();
      } catch {}
    }
    this.nodes.clear();
    return this.context.suspend();
  }
  effect(kind) {
    if (this.context.state !== "running") return;
    const notes =
      kind === "finish"
        ? [72, 76, 79, 84]
        : kind === "drop"
          ? [76, 67, 60]
          : kind === "mix"
            ? [60, 64, 67]
            : [79, 84];
    notes.forEach((note, index) =>
      this.tone(
        note,
        this.context.currentTime + index * 0.045,
        0.14,
        "triangle",
        0.15,
      ),
    );
  }
  dispose() {
    clearInterval(this.timer);
    return this.context.close();
  }
}
