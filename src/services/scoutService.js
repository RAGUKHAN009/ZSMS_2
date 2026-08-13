import { USE_APPWRITE, databases, DATABASE_ID, TABLES, ID, Query } from "./appwrite/appwrite";
import { getState, setCollection, addAuditLog } from "../data/mockDb";
import { getScoutSection, isPromotionDue, getPromotionTarget } from "../utils/ageUtils";
import { generateScoutId, getNextSectionNumber } from "../utils/idUtils";
import { todayISO } from "../utils/dateUtils";

// ---- Mock implementation --------------------------------------------------

async function mockGetScouts() {
  return getState().scouts;
}

async function mockGetScout(id) {
  return getState().scouts.find((s) => s.id === id) || null;
}

async function mockCreateScout(data, actorUser) {
  const section = getScoutSection(data.date_of_birth) || "SS";
  const nextNum = getNextSectionNumber(getState().scouts.map((s) => s.scout_id), section);
  const row = {
    id: `s-${Date.now()}`,
    scout_id: generateScoutId(section, nextNum),
    ...data,
    section,
    status: "submitted",
    created_by: actorUser.id,
    current_reviewer: null,
    created_at: todayISO(),
  };
  setCollection("scouts", (rows) => [row, ...rows]);
  addAuditLog({ actor: actorUser.full_name, action: "scout_created", entity: "scouts", entityId: row.id, newState: "submitted" });
  return row;
}

async function mockUpdateScout(id, patch) {
  setCollection("scouts", (rows) => rows.map((s) => (s.id === id ? { ...s, ...patch, updated_at: todayISO() } : s)));
}

async function mockSubmitScout(id, actorUser) {
  await mockUpdateScout(id, { status: "under_leader_review", current_reviewer: null });
  addAuditLog({ actor: actorUser.full_name, action: "scout_submitted", entity: "scouts", entityId: id, newState: "under_leader_review" });
}

async function mockApproveScout(id, actorUser, nextStatus = "under_gs_review") {
  await mockUpdateScout(id, { status: nextStatus });
  addAuditLog({ actor: actorUser.full_name, action: "scout_approved", entity: "scouts", entityId: id, newState: nextStatus });
}

async function mockRevertScout(id, actorUser, comment) {
  await mockUpdateScout(id, { status: "reverted_to_assistant" });
  addAuditLog({ actor: actorUser.full_name, action: "scout_reverted", entity: "scouts", entityId: id, comment });
}

async function mockPromoteScout(id, actorUser) {
  const scout = getState().scouts.find((s) => s.id === id);
  const target = getPromotionTarget(scout.section);
  if (!target) return;
  await mockUpdateScout(id, { section: target, status: "active", promotion_status: "completed" });
  addAuditLog({ actor: actorUser.full_name, action: "scout_promoted", entity: "scouts", entityId: id, oldState: scout.section, newState: target });
}

async function mockGetPendingPromotions() {
  return getState().scouts.filter((s) => isPromotionDue(s.date_of_birth, s.section));
}

// ---- Real Appwrite implementation ------------------------------------------

async function appwriteGetScouts() {
  const res = await databases.listDocuments(DATABASE_ID, TABLES.SCOUTS, [Query.orderDesc("created_at")]);
  return res.documents;
}

async function appwriteGetScout(id) {
  return databases.getDocument(DATABASE_ID, TABLES.SCOUTS, id);
}

async function appwriteCreateScout(data, actorUser) {
  const section = getScoutSection(data.date_of_birth) || "SS";
  // NOTE: generating the sequential Scout ID safely under concurrent writes
  // should happen in an Appwrite Function (e.g. an atomic counter document),
  // not purely client-side. This calls the same idUtils helper as the mock
  // path for now — replace with a Function call before production.
  return databases.createDocument(DATABASE_ID, TABLES.SCOUTS, ID.unique(), {
    ...data,
    section,
    status: "submitted",
    created_by: actorUser.user_id,
    created_at: new Date().toISOString(),
  });
}

async function appwriteUpdateScout(id, patch) {
  return databases.updateDocument(DATABASE_ID, TABLES.SCOUTS, id, patch);
}

// ---- Public API -------------------------------------------------------------

export async function getScouts() {
  return USE_APPWRITE ? appwriteGetScouts() : mockGetScouts();
}

export async function getScout(id) {
  return USE_APPWRITE ? appwriteGetScout(id) : mockGetScout(id);
}

export async function createScout(data, actorUser) {
  return USE_APPWRITE ? appwriteCreateScout(data, actorUser) : mockCreateScout(data, actorUser);
}

export async function updateScout(id, patch) {
  return USE_APPWRITE ? appwriteUpdateScout(id, patch) : mockUpdateScout(id, patch);
}

export async function submitScout(id, actorUser) {
  return USE_APPWRITE ? appwriteUpdateScout(id, { status: "under_leader_review" }) : mockSubmitScout(id, actorUser);
}

export async function approveScout(id, actorUser, nextStatus) {
  return USE_APPWRITE ? appwriteUpdateScout(id, { status: nextStatus || "under_gs_review" }) : mockApproveScout(id, actorUser, nextStatus);
}

export async function revertScout(id, actorUser, comment) {
  return USE_APPWRITE ? appwriteUpdateScout(id, { status: "reverted_to_assistant" }) : mockRevertScout(id, actorUser, comment);
}

export async function promoteScout(id, actorUser) {
  return USE_APPWRITE ? null /* TODO: wire to scout_promotions + Appwrite Function */ : mockPromoteScout(id, actorUser);
}

export async function getPendingPromotions() {
  const all = await getScouts();
  return USE_APPWRITE ? all.filter((s) => isPromotionDue(s.date_of_birth, s.section)) : mockGetPendingPromotions();
}
