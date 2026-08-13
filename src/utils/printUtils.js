// A4 print handling. Actual visual hiding of nav/sidebar/buttons is done
// via the `.no-print` class + the `@media print` rules in index.css.
// This just triggers the browser print dialog on the currently rendered
// printable view (see components/common/PrintableDoc.jsx).

export function triggerPrint() {
  window.print();
}

export const SIGNATURE_PAIRS = {
  SS: ["SSL Signature", "GSL Signature"],
  BS: ["SL Signature", "GSL Signature"],
  RS: ["RL Signature", "GSL Signature"],
  FINANCE: ["FS Signature", "GSL Signature"],
};

export function signaturesForSection(section) {
  return SIGNATURE_PAIRS[section] || ["Signature", "GSL Signature"];
}
