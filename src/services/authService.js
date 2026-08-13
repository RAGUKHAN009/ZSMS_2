import { USE_APPWRITE, account, databases, DATABASE_ID, TABLES, ID, Query } from "./appwrite/appwrite";
import { getState } from "../data/mockDb";

const SESSION_KEY = "zsms_mock_session";

// ---- Mock (default) implementation --------------------------------------

async function mockLogin(designation) {
  const profile = getState().users.find((u) => u.designation === designation);
  if (!profile) throw new Error(`No seeded user for role ${designation}`);
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  return profile;
}

async function mockLogout() {
  localStorage.removeItem(SESSION_KEY);
}

async function mockGetCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

// ---- Real Appwrite implementation ----------------------------------------
// Wire this up once Auth users + user_profiles rows exist. A typical flow:
//   1. account.createEmailPasswordSession(email, password)
//   2. const me = await account.get()
//   3. look up their user_profiles row by user_id === me.$id to get designation/section

async function appwriteLogin(email, password) {
  await account.createEmailPasswordSession(email, password);
  return appwriteGetCurrentUser();
}

async function appwriteLogout() {
  await account.deleteSession("current");
}

async function appwriteGetCurrentUser() {
  const me = await account.get();
  const res = await databases.listDocuments(DATABASE_ID, TABLES.USERS, [Query.equal("user_id", me.$id)]);
  return res.documents[0] || null;
}

// ---- Public API ------------------------------------------------------------
// In mock mode, `login` takes a role code (GSL/GS/SSL/...) for quick role
// switching in the demo. In real Appwrite mode, pass (email, password).

export async function login(identifier, password) {
  if (USE_APPWRITE) return appwriteLogin(identifier, password);
  return mockLogin(identifier);
}

export async function logout() {
  if (USE_APPWRITE) return appwriteLogout();
  return mockLogout();
}

export async function getCurrentUser() {
  if (USE_APPWRITE) {
    try {
      return await appwriteGetCurrentUser();
    } catch {
      return null;
    }
  }
  return mockGetCurrentUser();
}

export async function createUserProfile(profile) {
  if (USE_APPWRITE) {
    return databases.createDocument(DATABASE_ID, TABLES.USERS, ID.unique(), profile);
  }
  throw new Error("createUserProfile is only implemented against real Appwrite in this scaffold.");
}
