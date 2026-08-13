// Tiny local persistence layer standing in for Appwrite Databases while you
// wire up the real backend. Data lives in localStorage so it survives
// refreshes during development/demo. Swap USE_APPWRITE (see
// services/appwrite/appwrite.js) once your database exists — every
// *Service.js function already contains the real Appwrite call, commented
// in, right next to the mock call it replaces.

import { seedUsers, seedScouts, seedProposals, seedExpenses, seedEvents, seedNotifications } from "./mockData";

const STORAGE_KEY = "zsms_mock_db_v1";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("mockDb: failed to read localStorage, reseeding", e);
  }
  return {
    users: seedUsers,
    scouts: seedScouts,
    proposals: seedProposals,
    expenses: seedExpenses,
    events: seedEvents,
    notifications: seedNotifications,
    auditLogs: [],
  };
}

let state = loadInitial();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("mockDb: failed to persist", e);
  }
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return state;
}

export function setCollection(name, updater) {
  state = { ...state, [name]: updater(state[name]) };
  persist();
}

export function addAuditLog(entry) {
  setCollection("auditLogs", (rows) => [
    { id: `AL-${rows.length + 1}`, created_at: new Date().toISOString(), ...entry },
    ...rows,
  ]);
}

export function resetMockDb() {
  localStorage.removeItem(STORAGE_KEY);
  state = loadInitial();
  persist();
}
