const photos = [
  ["corrida-atleta-azul", 828],
  ["esporte-areia-atleta-bola", 702],
  ["areia-atleta-sorrindo", 779],
  ["corrida-atleta-bracos-erguidos", 828],
  ["motocross-piloto-lateral", 702],
  ["corrida-atleta-rosa", 630],
  ["areia-atleta-sentado", 757],
  ["corrida-atleta-oculos", 698],
] as const;

export async function decodeSheet() {
  return Promise.all(photos.map(async ([name, width]) => {
    const photo = new Image();
    photo.alt = "";
    photo.decoding = "async";
    photo.fetchPriority = "low";
    photo.sizes = "(max-width: 600px) 44vw, (max-width: 1072px) 21vw, 225px";
    photo.srcset = `/images/contact-sheet/${name}.webp 360w, /images/${name}.webp ${width}w`;
    photo.src = `/images/${name}.webp`;
    await photo.decode();
    return photo;
  }));
}

function ease(progress: number, start: number, end: number) {
  const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

export function renderSheet(sheet: HTMLElement, matte: HTMLElement, logo: HTMLElement, progress: number) {
  const convergence = ease(progress, .15, .65);
  sheet.style.transform = `scale(${1 - .21 * convergence})`;
  sheet.style.setProperty("--separation", String(1 - convergence));
  matte.style.opacity = String(ease(progress, .48, .80));
  logo.style.opacity = String(ease(progress, .80, .96));
}
