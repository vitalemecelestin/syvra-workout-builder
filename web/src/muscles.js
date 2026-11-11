// Couleur de pastille par groupe musculaire (repère visuel rapide).
// Toutes dérivées de la palette Syvra ; un groupe inconnu prend la couleur par défaut.
const COLORS = {
  Pectoraux: { bg: '#e3f1f7', fg: '#095573' },
  Dos: { bg: '#e6f6f4', fg: '#0f6b66' },
  Jambes: { bg: '#eaf7ef', fg: '#2a7a4b' },
  Épaules: { bg: '#eef0fb', fg: '#3c4c9a' },
  Bras: { bg: '#fdf1e6', fg: '#9a5512' },
  Abdos: { bg: '#f7ecf4', fg: '#8a3a72' },
};
const DEFAULT = { bg: '#eef2f6', fg: '#00274d' };

export function muscleStyle(group) {
  const c = COLORS[group] || DEFAULT;
  return { background: c.bg, color: c.fg };
}
