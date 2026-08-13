// Age must always be derived from Date of Birth — never trust a manually entered age.

export function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function ageInYears(dob) {
  const a = calculateAge(dob);
  return a ? a.years + a.months / 12 : null;
}

// Canonical section rule (see spec section 3):
// SS: age < 13, BS: 13 <= age < 18, RS: age >= 18
export function getScoutSection(dob) {
  const years = ageInYears(dob);
  if (years == null) return null;
  if (years < 13) return "SS";
  if (years < 18) return "BS";
  return "RS";
}

export function isPromotionDue(dob, currentSection) {
  const target = getScoutSection(dob);
  return target !== currentSection && target !== null;
}

export function getPromotionTarget(currentSection) {
  if (currentSection === "SS") return "BS";
  if (currentSection === "BS") return "RS";
  return null;
}
