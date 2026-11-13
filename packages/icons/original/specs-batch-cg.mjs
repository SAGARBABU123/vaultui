/**
 * Vault Icons - original masters, batch CG.
 *
 * Household and utility glyphs authored on the 24px grid, inner markup only.
 * Silhouettes are built from closed shapes so the fill weight reads solid.
 */

export const BATCH_CG = {
  "alarm-clock": `<circle cx="12" cy="13" r="6.6"/><path d="M4.6 7.2 3 4.6 6.6 5.2ZM19.4 7.2 21 4.6 17.4 5.2Z"/><path d="M7.4 18.8 5.6 21.4 7.2 21.4 9 19.4ZM16.6 18.8 18.4 21.4 16.8 21.4 15 19.4Z"/><path d="M11.4 9h1.2v4.2h-1.2ZM12 12.6l2.4 1.4-.6 1-2.4-1.4Z"/>`,
  alembic: `<path d="M4.4 14.4a5.6 5.6 0 0 1 5.6-5.6h4a5.6 5.6 0 0 1 0 11.2h-4a5.6 5.6 0 0 1-5.6-5.6Z"/><path d="M10 8.8V4.6c0-1 .8-1.8 1.8-1.8h.4c1 0 1.8.8 1.8 1.8V8.8Z"/><path d="M15.6 11.6 19 8.8l1.4 1.8-3.2 2.8Z"/>`,
  bench: `<rect x="3.4" y="11.6" width="17.2" height="2.4" rx="1"/><path d="M4.4 5.4h15.2v2H4.4ZM4.4 8.4h15.2v2H4.4Z"/><path d="M5.6 14h2v5.8h-2ZM16.4 14h2v5.8h-2Z"/>`,
  boomerang: `<path d="M3.4 8.2 6 5.6l6.2 9.6 6.2-9.6 2.6 2.6-7.4 11.4a2 2 0 0 1-3.4 0Z"/>`,
  bow: `<path d="M8.4 3.4C4.4 8 4.4 16 8.4 20.6h1.8C6.6 16.4 6.6 8 10.2 3.4Z"/><path d="M9.4 3.4H10.2L7.4 12 10.2 20.6H9.4L6.6 12Z"/><path d="M6.8 10.6h1.6v2.8H6.8Z"/>`,
  candle: `<rect x="9.4" y="9.4" width="5.2" height="10.4" rx="1"/><path d="M9.4 11.2h1.2v3.4c0 .6-.4 1-.6 1.4-.4-.6-1-1-1-1.8ZM14.6 11.2h-1.2v3.4c0 .6.4 1 .6 1.4.4-.6 1-1 1-1.8Z"/><path d="M12 3.2c1.6 1.8 2.4 3.4 2.4 4.8a2.4 2.4 0 0 1-4.8 0c0-1.4.8-3 2.4-4.8Z"/><rect x="7.4" y="19.8" width="9.2" height="1.6" rx=".8"/>`,
  canvas: `<rect x="4.4" y="3.4" width="15.2" height="10.8" rx="1.6"/><rect x="6.4" y="5.4" width="11.2" height="6.8" rx=".8"/><path d="M7.4 14.2H8.8L6.6 21H5.2ZM16.6 14.2H18L20.2 21H18.8ZM11.4 14.2h1.2v7h-1.2Z"/>`,
  cartridge: `<path d="M8.2 12.4h7.6v7.6l-1.2 1.4H9.4l-1.2-1.4Z"/><path d="M9 12.4V8.6c0-2 1.2-3.6 3-4.6 1.8 1 3 2.6 3 4.6v3.8Z"/><rect x="7.4" y="11.4" width="9.2" height="1.6" rx=".8"/>`,
  chains: `<rect x="9.4" y="2.8" width="5.2" height="6.4" rx="2.6"/><rect x="9.4" y="8.8" width="5.2" height="6.4" rx="2.6"/><rect x="9.4" y="14.8" width="5.2" height="6.4" rx="2.6"/>`,
  clamp: `<path d="M6 3.6h11v2.6h-6.2v11.6H17v2.6H6Z"/><rect x="11.4" y="11.4" width="1.6" height="6.4"/><rect x="10.4" y="17" width="3.6" height="1.6" rx=".8"/>`,
  comb: `<path d="M3.4 6.4h17.2v3.2H3.4Z"/><path d="M5 9.6h1.4V18H5ZM7.8 9.6h1.4V18H7.8ZM10.6 9.6h1.4V18h-1.4ZM13.4 9.6H14.8V18h-1.4ZM16.2 9.6h1.4V18h-1.4ZM19 9.6h1.4V16H19Z"/>`,
  "crystal-ball": `<circle cx="12" cy="10.4" r="7"/><path d="M7.4 17.4h9.2l1.4 3H6Z"/><path d="M9.4 7.4 10 8.8 11.4 9.4 10 10 9.4 11.4 8.8 10 7.4 9.4 8.8 8.8ZM14.4 10.6 14.8 11.6 15.8 12 14.8 12.4 14.4 13.4 14 12.4 13 12 14 11.6Z"/>`,
  curtain: `<path d="M4.4 3.4h5.2v16.8c-1.6-.6-2.8-2-3.2-4Z"/><path d="M19.6 3.4h-5.2v16.8c1.6-.6 2.8-2 3.2-4Z"/><rect x="3.4" y="2.6" width="17.2" height="1.6" rx=".8"/>`,
  dagger: `<path d="M11.4 3.4 12.6 3.4 14 12.6 12 15.4 10 12.6Z"/><rect x="6.4" y="12.4" width="11.2" height="2" rx="1"/><rect x="10.4" y="14.4" width="3.2" height="4.6" rx="1"/><circle cx="12" cy="19.8" r="1.4"/>`,
  doll: `<circle cx="12" cy="6.4" r="3.4"/><circle cx="7.6" cy="7" r="1.8"/><circle cx="16.4" cy="7" r="1.8"/><path d="M8.4 10.6h7.2l2 8.2H6.4Z"/>`,
  drill: `<rect x="3.4" y="7.4" width="10.4" height="5.2" rx="1.4"/><path d="M13.8 8.4h3.4l1.2 1.4-1.2 1.4h-3.4Z"/><path d="M18.4 9.2h3v1.6h-3Z"/><path d="M6.4 12.6h4.2l-1.6 7.2H5.2Z"/>`,
  "duffel-bag": `<rect x="4.4" y="8.4" width="15.2" height="9.2" rx="3.6"/><path d="M8.4 8.4v-1c0-2.2 1.4-3.8 3.6-3.8s3.6 1.6 3.6 3.8v1h-1.6v-1c0-1.4-.8-2.2-2-2.2s-2 .8-2 2.2v1Z"/><rect x="7" y="12.4" width="10" height="1.2" rx=".6"/>`,
  "frying-pan": `<path d="M3.4 11.4h10.4a4.2 4.2 0 0 1 0 8.4H3.4Z"/><path d="M13.8 14.2 20.6 12.4l.8 2.4-6.8 1.8Z"/><circle cx="7.4" cy="15.6" r="1.8"/>`,
  "gem-stone": `<path d="M8.4 4.4h7.2l4.4 5-8 10.4L4 9.4Z"/><path d="M4.8 8.6h14.4v1.2H4.8ZM8.2 4.6 11.2 8.8 12.4 8.8 9.4 4.6ZM15.8 4.6 14.6 4.6 11.8 8.8 13 8.8ZM11.4 9.4h1.2v4.6h-1.2Z"/>`,
  hook: `<path d="M11.4 3.4h1.6v8.2c0 2 1.2 3.2 3 3.2 1.6 0 2.6-1 2.6-2.6 0-1.4-.8-2.2-2-2.4l.2-1.6c2.2.2 3.6 1.8 3.6 4 0 2.4-1.8 4.2-4.4 4.2-2.8 0-4.8-1.8-4.8-4.8V3.4Z"/><rect x="8.4" y="2.8" width="7.2" height="2.2" rx=".8"/><path d="M13.8 11.4l2.2.8-1.4 1.4Z"/>`,
  kettle: `<path d="M6.4 9.4h9.2v6.2a3.6 3.6 0 0 1-3.6 3.6H10a3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M6.4 11.4 3.2 9.4l.8 2.4 2.4.8Z"/><path d="M8.4 9.4V8c0-2 1.6-3.4 3.6-3.4s3.6 1.4 3.6 3.4v1.4h-1.8V8c0-1.2-.8-2-1.8-2s-1.8.8-1.8 2v1.4Z"/><circle cx="12" cy="7.4" r="1"/>`,
  level: `<rect x="2.8" y="9.4" width="18.4" height="5.2" rx="1.4"/><rect x="8.4" y="10.6" width="7.2" height="2.8" rx="1.4"/><ellipse cx="12" cy="12" rx="1.4" ry="1"/><path d="M5 11.4a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0ZM17.4 11.4a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0Z"/>`,
  mallet: `<rect x="4.4" y="6.4" width="10.4" height="6.4" rx="3.2"/><rect x="12.8" y="8.4" width="7.6" height="2.4" rx="1.2"/><path d="M5.8 6.4h1.2v6.4H5.8ZM11.4 6.4h1.2v6.4h-1.2Z"/>`,
  match: `<rect x="11" y="9.4" width="1.8" height="11.4" rx=".9"/><rect x="10.4" y="7.4" width="3" height="2.8" rx="1.4"/><path d="M12 2.6c1.8 2 2.6 3.6 2.6 5a2.6 2.6 0 0 1-5.2 0c0-1.4.8-3 2.6-5Z"/>`,
  mirror: `<ellipse cx="12" cy="9.4" rx="6.6" ry="6.4"/><ellipse cx="12" cy="9.4" rx="5" ry="4.8"/><path d="M10.6 15.2h2.8l1.6 5.6h-6Z"/>`,
  mop: `<path d="M6.4 13.4h11.2l-1.4 5.4a2 2 0 0 1-2 1.6H9.8a2 2 0 0 1-2-1.6Z"/><path d="M7.6 13.4h1.2v4.6H7.6ZM10 13.4h1.2v5.8H10ZM12.8 13.4h1.2v5.8h-1.2ZM15.2 13.4h1.2v4.6h-1.2Z"/><rect x="11.2" y="3.4" width="1.6" height="10" rx=".8"/>`,
  mousetrap: `<rect x="3.4" y="10.4" width="17.2" height="8" rx="1.6"/><path d="M6 10.4c0-2.6 1.4-4 3.4-4h5.2c2 0 3.4 1.4 3.4 4Z"/><circle cx="16.4" cy="14.4" r="1.4"/><path d="M11.4 10.4h1.2v2.4h-1.2ZM10.2 12h3.6v1.2h-3.6Z"/>`,
  nail: `<ellipse cx="12" cy="4.4" rx="3.4" ry="1.4"/><path d="M10.6 5.2h2.8v10.4l-1.4 3.8-1.4-3.8Z"/>`,
  "oil-drum": `<rect x="5.4" y="4.4" width="13.2" height="16" rx="2"/><path d="M5.4 8.4h13.2v1.2H5.4ZM5.4 15.2h13.2v1.2H5.4Z"/><circle cx="12" cy="12" r="1.2"/>`,
  pan: `<path d="M5.4 10.4h13.2v4.8a4.2 4.2 0 0 1-4.2 4.2H9.6a4.2 4.2 0 0 1-4.2-4.2Z"/><path d="M4.6 10.4c0-2.4 3.2-4.2 7.4-4.2s7.4 1.8 7.4 4.2Z"/><rect x="10.8" y="3.6" width="2.4" height="1.8" rx=".9"/><path d="M18.6 11.6h2.8v1.8h-2.8Z"/>`,
};

export const BATCH_CG_FILLS = {};


