import { USE_APPWRITE, databases, DATABASE_ID, TABLES, ID, Query } from "./appwrite/appwrite";
import { getState, setCollection, addAuditLog } from "../data/mockDb";
import { generateExpenseNumber } from "../utils/idUtils";
import { todayISO } from "../utils/dateUtils";

// ---- Mock implementation --------------------------------------------------

async function mockGetExpenses() {
  return getState().expenses;
}

async function mockCreateExpense(data, actorUser) {
  const row = {
    id: `e-${Date.now()}`,
    expense_number: generateExpenseNumber(getState().expenses.map((e) => e.expense_number)),
    expense_date: todayISO(),
    month: new Date().toISOString().slice(0, 7),
    created_by: actorUser.id,
    status: "draft",
    total_amount: (data.items || []).reduce((sum, i) => sum + Number(i.total_expense || 0), 0),
    notes: data.notes || "",
    items: data.items || [],
  };
  setCollection("expenses", (rows) => [row, ...rows]);
  return row;
}

async function mockSubmitExpense(id, actorUser) {
  setCollection("expenses", (rows) => rows.map((e) => (e.id === id ? { ...e, status: "under_gs_review" } : e)));
  addAuditLog({ actor: actorUser.full_name, action: "expense_submitted", entity: "expenses", entityId: id, newState: "under_gs_review" });
}

async function mockRevertExpense(id, actorUser, comment) {
  setCollection("expenses", (rows) => rows.map((e) => (e.id === id ? { ...e, status: "reverted_to_fs" } : e)));
  addAuditLog({ actor: actorUser.full_name, action: "expense_reverted", entity: "expenses", entityId: id, comment });
}

async function mockGetEvents() {
  return getState().events;
}

async function mockSaveEventDraft(data, actorUser) {
  if (data.id) {
    setCollection("events", (rows) => rows.map((ev) => (ev.id === data.id ? { ...ev, ...data } : ev)));
    return data;
  }
  const row = { id: `ev-${Date.now()}`, status: "draft", created_by: actorUser.id, expenses: data.expenses || [], ...data };
  setCollection("events", (rows) => [row, ...rows]);
  return row;
}

async function mockSubmitEventExpense(id, actorUser) {
  setCollection("events", (rows) => rows.map((ev) => (ev.id === id ? { ...ev, status: "under_gs_review" } : ev)));
  addAuditLog({ actor: actorUser.full_name, action: "event_expense_submitted", entity: "events", entityId: id, newState: "under_gs_review" });
}

async function mockGetMonthlySummary() {
  const expenses = getState().expenses;
  const month = new Date().toISOString().slice(0, 7);
  const monthly = expenses.filter((e) => e.month === month);
  const totalExpenses = monthly.reduce((sum, e) => sum + Number(e.total_amount || 0), 0);
  return { month, totalIncome: 0, totalExpenses, balance: -totalExpenses };
}

// ---- Real Appwrite implementation ------------------------------------------

async function appwriteGetExpenses() {
  const res = await databases.listDocuments(DATABASE_ID, TABLES.EXPENSES, [Query.orderDesc("expense_date")]);
  return res.documents;
}

async function appwriteCreateExpense(data, actorUser) {
  const total = (data.items || []).reduce((sum, i) => sum + Number(i.total_expense || 0), 0);
  const expense = await databases.createDocument(DATABASE_ID, TABLES.EXPENSES, ID.unique(), {
    expense_date: new Date().toISOString().slice(0, 10),
    month: new Date().toISOString().slice(0, 7),
    created_by: actorUser.user_id,
    status: "draft",
    total_amount: total,
    notes: data.notes || "",
  });
  // TODO: write each item as its own row in TABLES.EXPENSE_ITEMS with expense_id = expense.$id
  return expense;
}

// ---- Public API -------------------------------------------------------------

export async function getExpenses() {
  return USE_APPWRITE ? appwriteGetExpenses() : mockGetExpenses();
}

export async function createExpense(data, actorUser) {
  return USE_APPWRITE ? appwriteCreateExpense(data, actorUser) : mockCreateExpense(data, actorUser);
}

export async function submitExpense(id, actorUser) {
  if (USE_APPWRITE) return databases.updateDocument(DATABASE_ID, TABLES.EXPENSES, id, { status: "under_gs_review" });
  return mockSubmitExpense(id, actorUser);
}

export async function revertExpense(id, actorUser, comment) {
  if (USE_APPWRITE) return databases.updateDocument(DATABASE_ID, TABLES.EXPENSES, id, { status: "reverted_to_fs" });
  return mockRevertExpense(id, actorUser, comment);
}

export async function getEvents() {
  if (USE_APPWRITE) {
    const res = await databases.listDocuments(DATABASE_ID, TABLES.EVENTS, [Query.orderDesc("event_date")]);
    return res.documents;
  }
  return mockGetEvents();
}

export async function saveEventExpenseDraft(data, actorUser) {
  if (USE_APPWRITE) {
    if (data.id) return databases.updateDocument(DATABASE_ID, TABLES.EVENTS, data.id, data);
    return databases.createDocument(DATABASE_ID, TABLES.EVENTS, ID.unique(), { ...data, status: "draft", created_by: actorUser.user_id });
  }
  return mockSaveEventDraft(data, actorUser);
}

export async function submitEventExpense(id, actorUser) {
  if (USE_APPWRITE) return databases.updateDocument(DATABASE_ID, TABLES.EVENTS, id, { status: "under_gs_review" });
  return mockSubmitEventExpense(id, actorUser);
}

export async function getMonthlyExpenses(month) {
  const all = await getExpenses();
  return all.filter((e) => e.month === (month || new Date().toISOString().slice(0, 7)));
}

export async function getMonthlySummary() {
  return mockGetMonthlySummary(); // same computation works for either backend once getExpenses() is real
}
