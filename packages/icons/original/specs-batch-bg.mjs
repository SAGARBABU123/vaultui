/**
 * Vault Icons - original masters, batch BG.
 *
 * Security threat-landscape glyphs authored on the 24px grid, inner markup
 * only. Glyphs that use an open path get a solid silhouette in BATCH_BG_FILLS.
 */

export const BATCH_BG = {
  threat: `<path d="M12 3.4 21 19.6H3Z"/><path d="M12.9 7.6 9.2 13h2.4l-.7 3.8 3.9-5.6h-2.4Z"/>`,
  "threat-intel": `<circle cx="12" cy="12" r="8.6"/><path d="M12 12 18.1 5.9A8.6 8.6 0 0 1 20.6 12Z"/><circle cx="15.2" cy="15.2" r="1.1"/><circle cx="8.6" cy="9" r="1"/>`,
  malware: `<rect x="6.6" y="6.6" width="10.8" height="10.8" rx="2.2"/><path d="M9.4 3.2v3.4M14.6 3.2v3.4M9.4 17.4v3.4M14.6 17.4v3.4M3.2 9.4h3.4M3.2 14.6h3.4M17.4 9.4h3.4M17.4 14.6h3.4"/><ellipse cx="12" cy="12" rx="2.2" ry="2.8"/><path d="M10.2 9.4 9.2 8.2M13.8 9.4 14.8 8.2"/>`,
  ransomware: `<path d="M7 3.6h6.4l3.6 3.6v13.2H7Z"/><path d="M13.4 3.6v3.6H17"/><rect x="12.2" y="13" width="7.4" height="6" rx="1.6"/><path d="M13.8 13v-1.4a2.1 2.1 0 0 1 4.2 0V13"/>`,
  spyware: `<rect x="3.4" y="6.4" width="17.2" height="14" rx="2"/><path d="M3.4 10.4h17.2"/><path d="M6.4 13.2S8.6 10.4 12 10.4s5.6 2.8 5.6 2.8-2.2 2.8-5.6 2.8-5.6-2.8-5.6-2.8Z"/><circle cx="12" cy="13.2" r="1.5"/>`,
  adware: `<rect x="3.4" y="4.6" width="13.2" height="10.4" rx="2"/><path d="M12.8 13.2 20.6 9v10.2l-7.8-4.2Z"/><rect x="11.6" y="13.6" width="2.2" height="4.4" rx="1.1"/>`,
  trojan: `<path d="M8.2 20.8v-4.2c0-1.8.8-3.2 2.2-4.2L9.4 8.6l2.4-1.6 2.2 2.6c2 .4 3.4 1.8 4 3.8l1 3.4-2 .7-1.1-1.7-2 .5.5 2.3-1.8.9-1.2-2.3-1.4.5v3.3Z"/>`,
  worm: `<circle cx="17.6" cy="7.4" r="2.4"/><circle cx="14.2" cy="10.4" r="2.1"/><circle cx="10.6" cy="13.2" r="1.9"/><circle cx="7" cy="16" r="1.7"/>`,
  rootkit: `<rect x="8.6" y="3.4" width="6.8" height="4.4" rx="1.4"/><path d="M12 7.8v2.4"/><path d="M6.6 15.4S8.4 12.8 12 12.8s5.4 2.6 5.4 2.6-1.8 2.6-5.4 2.6-5.4-2.6-5.4-2.6Z"/><path d="M6.8 18.6 17.2 11.4"/>`,
  keylogger: `<rect x="3.6" y="4.4" width="11.6" height="15.2" rx="2"/><path d="M3.6 9.4h11.6M3.6 14.4h11.6M7.6 4.4v15.2M11.2 4.4v15.2"/><path d="M13.4 12.6 20.8 15.2l-3 1.2-1.2 3Z"/>`,
  botnet: `<circle cx="12" cy="4.8" r="1.8"/><circle cx="5.4" cy="18" r="1.8"/><circle cx="18.6" cy="18" r="1.8"/><path d="M12 6.6 6.6 16.4M12 6.6 17.4 16.4M7.2 18h9.6"/>`,
  antivirus: `<path d="M12 3.4 19.6 6v6.2c0 4.4-3.2 7.2-7.6 8.4-4.4-1.2-7.6-4-7.6-8.4V6Z"/><ellipse cx="12" cy="11.4" rx="2" ry="2.6"/><path d="M10.4 8.8 9.6 7.8M13.6 8.8 14.4 7.8M9.6 11h-1.4M14.4 11h1.4M10.2 14l-1 1M13.8 14l1 1"/>`,
  phishing: `<rect x="12.4" y="10.4" width="8.2" height="6.4" rx="1.4"/><path d="m12.8 11.4 3.7 2.6 3.7-2.6"/><path d="M7 3.6h1.8v6.4a2.6 2.6 0 0 0 5.2 0V8.4h1.8v1.6a4.4 4.4 0 0 1-8.8 0Z"/><path d="M14.2 8.6 12.8 7.2l1-1 1.4 1.4Z"/>`,
  "spear-phishing": `<circle cx="14.4" cy="14.4" r="6"/><circle cx="14.4" cy="14.4" r="2.6"/><circle cx="14.4" cy="14.4" r=".9"/><path d="M5.2 3.6v6a2.8 2.8 0 0 0 5.6 0V8.2"/>`,
  smishing: `<rect x="13.4" y="5.4" width="7.2" height="13.2" rx="1.8"/><path d="M15.8 7.4h2.4"/><circle cx="17" cy="16.2" r=".8"/><path d="M5.6 3.6v6.2a2.8 2.8 0 0 0 5.6 0V8.4"/>`,
  spam: `<rect x="3.4" y="6.4" width="17.2" height="11.2" rx="1.8"/><path d="m4.2 7.6 7.8 5.4 7.8-5.4"/><path d="M4.4 3.6 20.2 20.4"/>`,
  scam: `<path d="M4.6 7.2c0-1.2 1-2 2.2-2h10.4c1.2 0 2.2.8 2.2 2v4.2c0 3.4-3.2 6.2-7.4 6.2S4.6 14.8 4.6 11.4Z"/><ellipse cx="9" cy="10.2" rx="1.3" ry="1"/><ellipse cx="15" cy="10.2" rx="1.3" ry="1"/><circle cx="18.4" cy="17.6" r="2.4"/>`,
  hacker: `<path d="M12 3.6c-3.6 0-6.4 2.8-6.4 6.4v1.2c0 1.6.6 2.6 1.6 3.4l.6 6.4h8.4l.6-6.4c1-.8 1.6-1.8 1.6-3.4V10c0-3.6-2.8-6.4-6.4-6.4Z"/><ellipse cx="12" cy="11" rx="3.2" ry="3.8"/>`,
  "cyber-attack": `<path d="M3.6 3.6h5v5h-5Z M10.4 3.6h5v5h-5Z M3.6 10.4h5v5h-5Z M10.4 10.4h5v5h-5Z"/><path d="M6.4 6.4 17.6 17.6M14 17.6h3.6V14"/><path d="M17.6 6.4 6.4 17.6M10 17.6H6.4V14"/>`,
  ddos: `<rect x="4.4" y="13.6" width="15.2" height="6.4" rx="1.6"/><path d="M6.4 3.4h2.2v4.4h2L7.5 11.8 4.4 7.8h2Z"/><path d="M11 3.4h2.2v4.4h2L12.1 11.8 9 7.8h2Z"/><path d="M15.6 3.4h2.2v4.4h2l-3.1 4-3.1-4h2Z"/>`,
  "brute-force": `<path d="M3.4 6.4 6 9.6l-2.6 3.2M6.8 5.6 9.4 8.8 6.8 12M10.2 4.8 12.8 8l-2.6 3.2"/><circle cx="16" cy="10" r="2.6"/><path d="M17.8 11.8 21 15M18.8 15H21v-2.2"/>`,
  exploit: `<rect x="4.4" y="4.4" width="15.2" height="15.2" rx="2.4"/><path d="M12 5 10.4 9.6l3 2.4-2.6 3.2 1.6 3.8"/>`,
  "zero-day": `<path d="M11.6 3.8A8.2 8.2 0 0 0 5.4 17.4l1.8-1.2-1-2.2 2.2-1.2-.8-2.4 2.4-.8-.4-2.4 2-.8Z"/><path d="M12.4 3.8A8.2 8.2 0 0 1 18.6 17.4l-1.8-1.2 1-2.2-2.2-1.2.8-2.4-2.4-.8.4-2.4-2-.8Z"/>`,
  vulnerability: `<rect x="4" y="8.4" width="16" height="10.4" rx="1"/><path d="M7.6 8.4v10.4M16.4 8.4v10.4"/><path d="M12 8.4v2.6l1.8 1.8-1.8 1.8v4.2"/>`,
  cve: `<path d="M3.8 11.8V5.4a1.6 1.6 0 0 1 1.6-1.6h6.4l7.8 7.8-8 8Z"/><circle cx="7.4" cy="7.4" r="1.1"/><path d="M13.4 8.4v3.4M13.4 14.2v.2"/>`,
  patch: `<path d="M15.8 3.6a4.2 4.2 0 0 0-3.6 6.2l-7.4 7.4a1.6 1.6 0 0 0 2.2 2.2l7.4-7.4a4.2 4.2 0 0 0 5.4-5.4l-2.2 2.2-2.2-.4-.4-2.2Z"/>`,
  backdoor: `<rect x="3.6" y="4.4" width="16.8" height="16" rx="1.4"/><rect x="9.2" y="8.4" width="6.4" height="12" rx=".8"/><path d="M9.2 8.4 6 10.8v9.6"/><circle cx="13.8" cy="14.4" r=".9"/>`,
  honeypot: `<path d="M6.4 9.6h11.2v8.2a2.2 2.2 0 0 1-2.2 2.2H8.6a2.2 2.2 0 0 1-2.2-2.2Z"/><rect x="5.4" y="7" width="13.2" height="2.6" rx="1.3"/><path d="M12 12.6c1.4 1.8 2 2.8 2 3.6a2 2 0 0 1-4 0c0-.8.6-1.8 2-3.6Z"/>`,
  "canary-token": `<circle cx="12" cy="12" r="8.6"/><ellipse cx="11.6" cy="13" rx="3.2" ry="2.6"/><circle cx="14.6" cy="10.6" r="1.8"/><path d="M16.2 10.4 18 9.6 16.4 11.6Z"/>`,
  "attack-surface": `<path d="M4 4h6v6H4Z M12 4h6v6h-6Z M4 12h6v6H4Z M12 12h6v6h-6Z"/><circle cx="15" cy="7" r="3.4"/><path d="M21.2 3.8 17.4 7.6M17.4 4.4v3.2h3.2"/>`,
};

export const BATCH_BG_FILLS = {
  malware: `<path d="M6.6 6.6h10.8v10.8H6.6Zm2 2h6.8v6.8H8.6Z" fill-rule="evenodd"/><ellipse cx="12" cy="12" rx="2.2" ry="2.8"/><path d="M8.6 2.6h1.6v4H8.6Z M13.8 2.6h1.6v4h-1.6Z M8.6 17.4h1.6v4H8.6Z M13.8 17.4h1.6v4h-1.6Z M2.6 8.6h4v1.6h-4Z M2.6 13.8h4v1.6h-4Z M17.4 8.6h4v1.6h-4Z M17.4 13.8h4v1.6h-4Z"/>`,
  ransomware: `<path d="M7 3.6h6.4l3.6 3.6v13.2H7Z"/><rect x="12.2" y="13" width="7.4" height="6" rx="1.6"/><path d="M13.8 13v-1.4a2.1 2.1 0 0 1 4.2 0V13h-1.4v-1.4a.7.7 0 0 0-1.4 0V13Z"/>`,
  spyware: `<path d="M3.4 6.4h17.2v14H3.4Zm2 2h13.2v10H5.4Z" fill-rule="evenodd"/><path d="M6.4 13.2S8.6 10.4 12 10.4s5.6 2.8 5.6 2.8-2.2 2.8-5.6 2.8-5.6-2.8-5.6-2.8Z"/>`,
  rootkit: `<rect x="8.6" y="3.4" width="6.8" height="4.4" rx="1.4"/><rect x="11.2" y="7.8" width="1.6" height="2.4"/><path d="M6.6 15.4S8.4 12.8 12 12.8s5.4 2.6 5.4 2.6-1.8 2.6-5.4 2.6-5.4-2.6-5.4-2.6Z"/><path d="M6.4 18.9 16.9 11.4l.7.9L7.1 19.8Z"/>`,
  keylogger: `<path d="M3.6 4.4h11.6v15.2H3.6Zm1.6 1.6h8.4v12H5.2Z" fill-rule="evenodd"/><path d="M3.6 8.8h11.6v1.2H3.6Z M3.6 13.8h11.6v1.2H3.6Z M7 4.4h1.2v15.2H7Z M10.6 4.4h1.2v15.2h-1.2Z"/><path d="M13.4 12.6 20.8 15.2l-3 1.2-1.2 3Z"/>`,
  botnet: `<circle cx="12" cy="4.8" r="1.8"/><circle cx="5.4" cy="18" r="1.8"/><circle cx="18.6" cy="18" r="1.8"/><path d="M11.4 6.4 6.6 16.4l-.9-.5 4.8-10ZM12.6 6.4l4.8 10-.9.5-4.8-10ZM7.2 17.2h9.6v1.2H7.2Z"/>`,
  antivirus: `<path d="M12 3.4 19.6 6v6.2c0 4.4-3.2 7.2-7.6 8.4-4.4-1.2-7.6-4-7.6-8.4V6Zm0 2.2L5.8 7.3v4.9c0 3.3 2.2 5.5 6.2 6.7 4-1.2 6.2-3.4 6.2-6.7V7.3Z" fill-rule="evenodd"/><ellipse cx="12" cy="11.4" rx="2" ry="2.6"/>`,
  phishing: `<rect x="12.4" y="10.4" width="8.2" height="6.4" rx="1.4"/><path d="M12.4 11.4 16.1 14l3.7-2.6v1.6l-3.7 2.6-3.7-2.6Z"/><path d="M7 3.6h1.8v6.4a2.6 2.6 0 0 0 5.2 0V8.4h1.8v1.6a4.4 4.4 0 0 1-8.8 0Z"/><path d="M14.2 8.6 12.8 7.2l1-1 1.4 1.4Z"/>`,
  "spear-phishing": `<path d="M14.4 8.4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 1.8a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Z" fill-rule="evenodd"/><circle cx="14.4" cy="14.4" r="1.9"/><path d="M4.6 3.6h1.8v6a1.8 1.8 0 0 0 3.6 0V8.2h1.8v1.4a3.6 3.6 0 0 1-7.2 0Z"/>`,
  smishing: `<rect x="13.4" y="5.4" width="7.2" height="13.2" rx="1.8"/><rect x="15.6" y="7" width="2.8" height="1.2" rx=".6"/><circle cx="17" cy="16.2" r=".8"/><path d="M5 3.6h1.8v6.2a1.8 1.8 0 0 0 3.6 0V8.4H12v1.4a3.6 3.6 0 0 1-7 0Z"/>`,
  spam: `<rect x="3.4" y="6.4" width="17.2" height="11.2" rx="1.8"/><path d="M3.4 7.6 11.2 13l7.8-5.4v1.6l-7.8 5.4-7.8-5.4Z"/><path d="M5.2 3.4 20.6 18.8l-1.6 1.6L3.6 5Z"/>`,
  scam: `<path d="M4.6 7.2c0-1.2 1-2 2.2-2h10.4c1.2 0 2.2.8 2.2 2v4.2c0 3.4-3.2 6.2-7.4 6.2S4.6 14.8 4.6 11.4Zm3.1 3a1.3 1 0 1 0 2.6 0 1.3 1 0 1 0-2.6 0Zm6 0a1.3 1 0 1 0 2.6 0 1.3 1 0 1 0-2.6 0Z" fill-rule="evenodd"/><circle cx="18.4" cy="17.6" r="2.4"/>`,
  hacker: `<path d="M12 3.6c-3.6 0-6.4 2.8-6.4 6.4v1.2c0 1.6.6 2.6 1.6 3.4l.6 6.4h8.4l.6-6.4c1-.8 1.6-1.8 1.6-3.4V10c0-3.6-2.8-6.4-6.4-6.4Zm0 3.6a3.2 3.8 0 1 1 0 7.6 3.2 3.8 0 0 1 0-7.6Z" fill-rule="evenodd"/>`,
  "cyber-attack": `<path d="M3.6 3.6h5v5h-5Z M10.4 3.6h5v5h-5Z M3.6 10.4h5v5h-5Z M10.4 10.4h5v5h-5Z"/><path d="M5.6 6.4 6.4 5.6 18.4 17.6l-.8.8Z M14.4 18.4h4V14.4l-1.2-1.2v3.2h-3.2Z M18.4 5.6l.8.8L6.4 18.4l-.8-.8Z M5.6 18.4h4l-1.2-1.2H5.6Z"/>`,
  "brute-force": `<path d="M3.4 6.4 6.6 9.6 3.4 12.8Z M7 5.4 10.2 8.6 7 11.8Z M10.6 4.4 13.8 7.6 10.6 10.8Z"/><circle cx="16" cy="10" r="2.6"/><path d="M17.4 11.4 21 15l-1.2 1.2-3.6-3.6Z M21 15l-1.6-1.6v3.2Z"/>`,
  exploit: `<rect x="4.4" y="4.4" width="15.2" height="15.2" rx="2.4"/><path d="M11.2 4.6 9.6 9.6l2.8 2.4-2.4 3.2 1.4 3.4 1.6-.8-1.2-2.8 2.8-3.6-2.8-2.4 1.2-4Z"/>`,
  vulnerability: `<rect x="4" y="8.4" width="16" height="10.4" rx="1"/><path d="M7 8.4h1.2v10.4H7Z M15.8 8.4H17v10.4h-1.2Z M11.4 8.4h1.2v2.4l1.6 1.8-1.6 1.8v4.4h-1.2v-4.9l1.6-1.3-1.6-1.3Z"/>`,
  cve: `<path d="M3.8 11.8V5.4a1.6 1.6 0 0 1 1.6-1.6h6.4l7.8 7.8-8 8Zm3.6-6.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z" fill-rule="evenodd"/><path d="M12.6 8.4h1.6v3.4h-1.6Z M12.6 13.6h1.6v1.6h-1.6Z"/>`,
  backdoor: `<path d="M3.6 4.4h16.8v16H3.6Zm5.6 4v12h6.4v-12Z" fill-rule="evenodd"/><path d="M9.2 8.4 6 10.8v9.6l3.2-2.4Z"/><circle cx="13.8" cy="14.4" r=".9"/>`,
  "attack-surface": `<path d="M4 4h6v6H4Z M12 4h6v6h-6Z M4 12h6v6H4Z M12 12h6v6h-6Z"/><circle cx="15" cy="7" r="3.4"/><path d="M17.4 7 21 3.4l.6.6-3.6 3.6Z M17.4 4.4h3.6v3.6l-1.2-1.2V5.6h-1.2Z"/>`,
};
