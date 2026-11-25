// Paths are drawn in a 64-unit square and sampled again for the dissolution.
const circle = "M32 4a28 28 0 1 0 .01 0Z ";
const paths = [
  circle + "M32 21l11 8-4 13H25l-4-13Z M32 21V11l-7-5 M43 29l11-4 4 4 M39 42l8 9-1 5 M25 42l-8 9 1 5 M21 29l-11-4-4 4",
  circle + "M4 32h56 M32 4v56 M12 12q29 20 0 40 M52 12q-29 20 0 40",
  circle + "M32 32Q21 14 34 4 M32 32Q52 32 58 43 M32 32Q22 51 8 45 M21 28Q15 15 23 6 M21 47Q40 43 50 53 M46 24Q44 12 39 5",
  circle + "M32 19l12 7v13l-12 7-12-7V26Z M32 19l20-1 M44 26l11 17 M44 39l-9 19 M32 46l-21 1 M20 39L8 22 M20 26l9-20",
  circle + "M32 11a21 21 0 1 0 .01 0Z M32 28a4 4 0 1 0 .01 0Z M30 28l-7-15 M35 29l12-12 M36 32l16-5 M35 35l12 12 M32 36l3 16 M29 35L17 46 M28 32l-16 5 M29 29L16 19",
  "M32 13a22 22 0 1 0 .01 0Z M26 4h12 M32 4v9 M48 17l4-5 4 4 M32 18v3 M48 35h3 M32 50v3 M13 35h3 M32 35l10-12",
];
const ease = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

function pixels(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  const points: number[] = [];
  for (let i = 0; i < width * height; i++) if (data[i * 4 + 3] > 100) points.push(i);
  return points;
}

export function createMotion(canvas: HTMLCanvasElement, logo: HTMLImageElement) {
  const ctx = canvas.getContext("2d");
  const mask = document.createElement("canvas");
  const sampling = mask.getContext("2d", { willReadFrequently: true });
  if (!ctx || !sampling) return;
  const icons = paths.map(path => new Path2D(path));
  mask.width = mask.height = 64;
  sampling.lineWidth = 1.8;
  const outlines = icons.map(icon => {
    sampling.clearRect(0, 0, 64, 64);
    sampling.stroke(icon);
    return pixels(sampling);
  });
  mask.width = logo.naturalWidth;
  mask.height = logo.naturalHeight;
  sampling.drawImage(logo, 0, 0);
  const signature = pixels(sampling);
  if (!signature.length) return;
  let seed = 703;
  const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296);
  const dots = Array.from({ length: 4000 }, (_, i) => {
    const icon = i % icons.length;
    const source = outlines[icon][Math.floor(random() * outlines[icon].length)];
    const target = signature[Math.floor(random() * signature.length)];
    return { icon, sx: source % 64 - 32, sy: Math.floor(source / 64) - 32,
      tx: (target % mask.width + .5) / mask.width - .5,
      ty: (Math.floor(target / mask.width) + .5 - mask.height / 2) / mask.width,
      drift: random(), spread: random() - .5, phase: random() * Math.PI * 2 };
  });
  let w = 1, h = 1, count = 1000;
  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio, 1.5);
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    count = w < 600 ? 1000 : w < 1100 ? 2400 : 4000;
  }
  function draw(p: number) {
    if (!ctx) return;
    const unit = Math.min(w / 520, h / 420, 2);
    const span = Math.min(w * .79, 950);
    const brand = logo.clientWidth;
    const x = (i: number) => w / 2 + (i / 5 - .5) * span;
    const y = (i: number) => h / 2 - (i / 5 - .5) * Math.min(h * .29, span * .48);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = ctx.fillStyle = "#f6f7f7";
    icons.forEach((icon, i) => {
      const entry = ease((p + .055 - i * .041) / .09);
      const fade = 1 - ease((p - .30 - i * .013) / .11);
      ctx.save();
      ctx.translate(x(i), y(i));
      const size = unit * (.82 + .18 * entry);
      ctx.scale(size, size);
      ctx.translate(-32, -32);
      ctx.globalAlpha = entry * fade;
      ctx.lineWidth = 1.35;
      ctx.stroke(icon);
      ctx.globalAlpha *= .35;
      ctx.beginPath();
      ctx.moveTo(-15, 41); ctx.lineTo(0, 37);
      ctx.moveTo(-9, 48); ctx.lineTo(2, 45);
      ctx.stroke();
      ctx.restore();
    });
    const converge = ease((p - .62) / .32);
    const reveal = ease((p - .83) / .11);
    logo.style.opacity = String(reveal);
    if (p <= .30 || reveal === 1) return;
    for (let i = 0; i < count; i++) {
      const d = dots[i];
      const flow = ease((p - .30 - d.icon * .013 - d.drift * .05) / .25);
      const ax = x(d.icon) + d.sx * unit;
      const ay = y(d.icon) + d.sy * unit;
      const bx = ax + span * (.05 + .27 * d.drift) * flow;
      const by = ay + flow * h * (.30 * d.spread + .06 * Math.sin(d.phase + p * 8));
      const px = bx + (w / 2 + d.tx * brand - bx) * converge;
      const py = by + (h / 2 + d.ty * brand - by) * converge;
      ctx.globalAlpha = flow * (1 - reveal) * (.35 + .6 * d.drift);
      ctx.fillRect(px, py, .8 + unit * .45, .8 + unit * .45);
      ctx.globalAlpha *= .16 * (1 - converge);
      ctx.fillRect(px - 4 * flow, py, 4 * flow, .7);
    }
    ctx.globalAlpha = 1;
  }
  return { resize, draw };
}
