import { USE_APPWRITE, databases, DATABASE_ID, TABLES, ID, Query } from "./appwrite/appwrite";
import { getState, setCollection } from "../data/mockDb";

async function mockCreateNotification(data) {
  const row = { id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, read: false, created_at: new Date().toISOString(), ...data };
  setCollection("notifications", (rows) => [row, ...rows]);
  return row;
}

async function mockGetNotifications(userId) {
  return getState().notifications.filter((n) => n.recipient_user_id === userId);
}

async function mockMarkRead(id) {
  setCollection("notifications", (rows) => rows.map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export async function createNotification(data) {
  if (USE_APPWRITE) {
    return databases.createDocument(DATABASE_ID, TABLES.NOTIFICATIONS, ID.unique(), { ...data, read: false, created_at: new Date().toISOString() });
  }
  return mockCreateNotification(data);
}

export async function getNotifications(userId) {
  if (USE_APPWRITE) {
    const res = await databases.listDocuments(DATABASE_ID, TABLES.NOTIFICATIONS, [
      Query.equal("recipient_user_id", userId),
      Query.orderDesc("created_at"),
    ]);
    return res.documents;
  }
  return mockGetNotifications(userId);
}

export async function markNotificationRead(id) {
  if (USE_APPWRITE) {
    return databases.updateDocument(DATABASE_ID, TABLES.NOTIFICATIONS, id, { read: true });
  }
  return mockMarkRead(id);
}
