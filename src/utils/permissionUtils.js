// Frontend visibility is NOT security. These helpers only control what the
// UI shows/hides. The real authorization boundary must be enforced by
// Appwrite Databases/Storage permissions and, where needed, Appwrite
// Functions — never trust the frontend alone (see spec section 15 & 31).

export const ROLES = ["GSL", "GS", "SSL", "ASSL", "SL", "ASL", "RL", "ARL", "FS", "OS"];

export const SECTION_BY_ROLE = {
  SSL: "SS", ASSL: "SS",
  SL: "BS", ASL: "BS",
  RL: "RS", ARL: "RS",
};

export const ASSISTANT_ROLES = ["ASSL", "ASL", "ARL"];
export const SENIOR_LEADER_ROLES = ["SSL", "SL", "RL"];

export function canCreateScout(role) {
  return ASSISTANT_ROLES.includes(role);
}

export function canReviewScout(role) {
  return SENIOR_LEADER_ROLES.includes(role);
}

export function canSubmitProposal(role) {
  return SENIOR_LEADER_ROLES.includes(role);
}

export function canForwardProposal(role) {
  return role === "GS";
}

export function canDecideProposal(role) {
  return role === "GSL";
}

export function canManageFinance(role) {
  return role === "FS";
}

export function canReviewFinance(role) {
  return role === "GS";
}

export function isAdminLike(role) {
  return role === "GSL";
}

export function navItemsForRole(role) {
  const items = [{ to: "/dashboard", label: "Dashboard" }];

  if (canCreateScout(role) || canReviewScout(role) || role === "GS" || role === "GSL") {
    items.push({ to: "/scouts", label: "Scouts" });
  }
  if (canSubmitProposal(role) || role === "GS" || role === "GSL") {
    items.push({ to: "/proposals", label: "Activity Proposals" });
  }
  if (canManageFinance(role) || canReviewFinance(role) || role === "GSL") {
    items.push({ to: "/finance", label: "Finance" });
  }
  if (role === "GSL") {
    items.push({ to: "/promotions", label: "Promotions" });
  }
  items.push({ to: "/reports", label: "Reports" });
  items.push({ to: "/settings", label: "Settings" });
  items.push({ to: "/profile", label: "Profile" });
  return items;
}
