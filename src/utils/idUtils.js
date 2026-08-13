// Scout ID format: IDBS-ZG-XX-0000
// NOTE: the running sequence number must ultimately be generated safely
// server-side (e.g. an Appwrite Function with a counter document / lock)
// so two simultaneous submissions can never collide. This client-side
// version is only a placeholder for the mock/demo data layer.

const PREFIX = "IDBS-ZG";

export function generateScoutId(section, nextNumber) {
  const padded = String(nextNumber).padStart(4, "0");
  return `${PREFIX}-${section}-${padded}`;
}

export function validateScoutId(id) {
  return /^IDBS-ZG-(SS|BS|RS)-\d{4}$/.test(id);
}

export function getNextSectionNumber(existingIds, section) {
  const nums = existingIds
    .filter((id) => id.includes(`-${section}-`))
    .map((id) => parseInt(id.split("-").pop(), 10))
    .filter((n) => !Number.isNaN(n));
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

export function generateProposalId(existingIds) {
  const nums = existingIds
    .map((id) => parseInt(id.replace("PR-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `PR-${String(next).padStart(4, "0")}`;
}

export function generateExpenseNumber(existingNumbers) {
  const nums = existingNumbers
    .map((n) => parseInt(String(n).replace("EXP-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `EXP-${String(next).padStart(4, "0")}`;
}
