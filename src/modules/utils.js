
export const currency = (v, frac=0)=> isFinite(v) ? v.toLocaleString('ro-RO',{style:'currency',currency:'EUR',maximumFractionDigits:frac}) : '-';
export const number = (v, frac=0)=> isFinite(v) ? v.toLocaleString('ro-RO',{maximumFractionDigits:frac}) : '-';
