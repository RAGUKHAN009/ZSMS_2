// Central Appwrite client. The rest of the service layer imports `account`,
// `databases`, and `storage` from here rather than constructing clients ad hoc.
//
// This project ships with VITE_USE_APPWRITE=false by default so it runs
// immediately against in-memory mock data (see services/*Service.js and
// data/mockData.js). Flip VITE_USE_APPWRITE=true once your Appwrite
// project/database/tables/buckets exist and .env is filled in — every
// service function already has the real Appwrite call written and
// commented in, so no rewiring should be needed beyond that flag.

import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from "appwrite";

export const USE_APPWRITE = import.meta.env.VITE_USE_APPWRITE === "true";

export const client = new Client();

if (USE_APPWRITE) {
  client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const TABLES = {
  USERS: import.meta.env.VITE_APPWRITE_TABLE_USERS || "user_profiles",
  SCOUTS: import.meta.env.VITE_APPWRITE_TABLE_SCOUTS || "scouts",
  SCOUT_WORKFLOW: import.meta.env.VITE_APPWRITE_TABLE_SCOUT_WORKFLOW || "scout_workflow",
  SCOUT_PROMOTIONS: import.meta.env.VITE_APPWRITE_TABLE_SCOUT_PROMOTIONS || "scout_promotions",
  EXPENSES: import.meta.env.VITE_APPWRITE_TABLE_EXPENSES || "expenses",
  EXPENSE_ITEMS: import.meta.env.VITE_APPWRITE_TABLE_EXPENSE_ITEMS || "expense_items",
  EXPENSE_FILES: import.meta.env.VITE_APPWRITE_TABLE_EXPENSE_FILES || "expense_files",
  EVENTS: import.meta.env.VITE_APPWRITE_TABLE_EVENTS || "events",
  EVENT_EXPENSES: import.meta.env.VITE_APPWRITE_TABLE_EVENT_EXPENSES || "event_expenses",
  EVENT_EXPENSE_FILES: import.meta.env.VITE_APPWRITE_TABLE_EVENT_EXPENSE_FILES || "event_expense_files",
  PROPOSALS: import.meta.env.VITE_APPWRITE_TABLE_PROPOSALS || "activity_proposals",
  NOTIFICATIONS: import.meta.env.VITE_APPWRITE_TABLE_NOTIFICATIONS || "notifications",
  AUDIT_LOGS: import.meta.env.VITE_APPWRITE_TABLE_AUDIT_LOGS || "audit_logs",
};

export const BUCKETS = {
  SCOUT_IMAGES: import.meta.env.VITE_APPWRITE_BUCKET_SCOUT_IMAGES || "scout-images",
  EXPENSE_BILLS: import.meta.env.VITE_APPWRITE_BUCKET_EXPENSE_BILLS || "expense-bills",
  EVENT_BILLS: import.meta.env.VITE_APPWRITE_BUCKET_EVENT_BILLS || "event-bills",
  DOCUMENTS: import.meta.env.VITE_APPWRITE_BUCKET_DOCUMENTS || "documents",
};

export { ID, Query, Permission, Role };
