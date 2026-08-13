import { USE_APPWRITE, databases, DATABASE_ID, TABLES, ID, Query } from "./appwrite/appwrite";
import { getState, setCollection, addAuditLog } from "../data/mockDb";
import { generateProposalId } from "../utils/idUtils";
import { todayISO, daysUntil } from "../utils/dateUtils";
import { createNotification } from "./notificationService";

// ---- Mock implementation --------------------------------------------------

async function mockGetProposals() {
  return getState().proposals;
}

async function mockGetProposal(id) {
  return getState().proposals.find((p) => p.id === id) || null;
}

async function mockCreateProposal(data, actorUser) {
  const id = generateProposalId(getState().proposals.map((p) => p.id));
  const row = {
    id,
    ...data,
    submitted_by: actorUser.id,
    submitting_role: actorUser.designation,
    status: "submitted_to_gs",
    created_at: todayISO(),
  };
  setCollection("proposals", (rows) => [row, ...rows]);
  addAuditLog({ actor: actorUser.full_name, action: "proposal_submitted", entity: "activity_proposals", entityId: id, newState: "submitted_to_gs" });

  const gsUsers = getState().users.filter((u) => u.designation === "GS");
  gsUsers.forEach((gs) => createNotification({
    recipient_user_id: gs.id, type: "proposal_submitted",
    title: "New activity proposal", message: `${row.activity_name} was submitted by ${actorUser.full_name}.`,
    related_record_id: id,
  }));
  return row;
}

async function mockGsForwardProposal(id, actorUser) {
  setCollection("proposals", (rows) => rows.map((p) => (p.id === id
    ? { ...p, status: "under_gsl_review", gs_reviewed_by: actorUser.id }
    : p)));
  addAuditLog({ actor: actorUser.full_name, action: "proposal_forwarded", entity: "activity_proposals", entityId: id, newState: "under_gsl_review" });

  const gslUsers = getState().users.filter((u) => u.designation === "GSL");
  const proposal = getState().proposals.find((p) => p.id === id);
  gslUsers.forEach((gsl) => createNotification({
    recipient_user_id: gsl.id, type: "proposal_forwarded",
    title: "Proposal awaiting your decision", message: `${proposal.activity_name} was verified and forwarded by GS.`,
    related_record_id: id,
  }));
}

async function mockGsRevertProposal(id, actorUser, comment) {
  setCollection("proposals", (rows) => rows.map((p) => (p.id === id
    ? { ...p, status: "reverted_to_leader", gsl_comment: comment }
    : p)));
  addAuditLog({ actor: actorUser.full_name, action: "proposal_reverted", entity: "activity_proposals", entityId: id, comment });
}

async function mockGslDecide(id, decision, actorUser, comment) {
  const proposal = getState().proposals.find((p) => p.id === id);
  setCollection("proposals", (rows) => rows.map((p) => (p.id === id
    ? {
        ...p,
        status: decision,
        gsl_decision_by: actorUser.id,
        gsl_comment: comment,
        executing_leader: decision === "accepted" ? p.submitting_role : undefined,
      }
    : p)));
  addAuditLog({ actor: actorUser.full_name, action: `proposal_${decision}`, entity: "activity_proposals", entityId: id, newState: decision, comment });

  const submitter = getState().users.find((u) => u.id === proposal.submitted_by);
  if (submitter) {
    createNotification({
      recipient_user_id: submitter.id,
      type: decision === "accepted" ? "proposal_accepted" : "proposal_rejected",
      title: decision === "accepted" ? "Proposal accepted" : "Proposal rejected",
      message: decision === "accepted"
        ? `${proposal.activity_name} was accepted — you're assigned to execute it.`
        : `${proposal.activity_name} was rejected.${comment ? " Comment: " + comment : ""}`,
      related_record_id: id,
    });
  }
}

async function mockGetUpcomingExecutions(withinDays = 3) {
  return getState().proposals.filter((p) => {
    if (p.status !== "accepted") return false;
    const d = daysUntil(p.execution_date);
    return d >= 0 && d <= withinDays;
  });
}

// ---- Real Appwrite implementation ------------------------------------------

async function appwriteGetProposals() {
  const res = await databases.listDocuments(DATABASE_ID, TABLES.PROPOSALS, [Query.orderDesc("created_at")]);
  return res.documents;
}

async function appwriteGetProposal(id) {
  return databases.getDocument(DATABASE_ID, TABLES.PROPOSALS, id);
}

async function appwriteCreateProposal(data, actorUser) {
  return databases.createDocument(DATABASE_ID, TABLES.PROPOSALS, ID.unique(), {
    ...data,
    submitted_by: actorUser.user_id,
    submitting_role: actorUser.designation,
    status: "submitted_to_gs",
    created_at: new Date().toISOString(),
  });
  // TODO: also write a `notifications` row for each GS user, mirroring
  // the mock implementation above. Consider doing this inside an
  // Appwrite Function trigger on row-create instead of client-side.
}

async function appwriteGsForwardProposal(id, actorUser) {
  return databases.updateDocument(DATABASE_ID, TABLES.PROPOSALS, id, {
    status: "under_gsl_review",
    gs_reviewed_by: actorUser.user_id,
    gs_reviewed_at: new Date().toISOString(),
  });
}

async function appwriteGslDecide(id, decision, actorUser, comment) {
  const proposal = await appwriteGetProposal(id);
  return databases.updateDocument(DATABASE_ID, TABLES.PROPOSALS, id, {
    status: decision,
    gsl_decision_by: actorUser.user_id,
    gsl_decision_at: new Date().toISOString(),
    gsl_comment: comment || "",
    executing_leader: decision === "accepted" ? proposal.submitting_role : null,
  });
}

// ---- Public API -------------------------------------------------------------

export async function getProposals() {
  return USE_APPWRITE ? appwriteGetProposals() : mockGetProposals();
}

export async function getProposal(id) {
  return USE_APPWRITE ? appwriteGetProposal(id) : mockGetProposal(id);
}

export async function createProposal(data, actorUser) {
  return USE_APPWRITE ? appwriteCreateProposal(data, actorUser) : mockCreateProposal(data, actorUser);
}

export async function gsForwardProposal(id, actorUser) {
  return USE_APPWRITE ? appwriteGsForwardProposal(id, actorUser) : mockGsForwardProposal(id, actorUser);
}

export async function gsRevertProposal(id, actorUser, comment) {
  if (USE_APPWRITE) {
    return databases.updateDocument(DATABASE_ID, TABLES.PROPOSALS, id, { status: "reverted_to_leader", gsl_comment: comment || "" });
  }
  return mockGsRevertProposal(id, actorUser, comment);
}

export async function gslAcceptProposal(id, actorUser, comment) {
  return USE_APPWRITE ? appwriteGslDecide(id, "accepted", actorUser, comment) : mockGslDecide(id, "accepted", actorUser, comment);
}

export async function gslRejectProposal(id, actorUser, comment) {
  return USE_APPWRITE ? appwriteGslDecide(id, "rejected", actorUser, comment) : mockGslDecide(id, "rejected", actorUser, comment);
}

export async function getProposalsAwaitingGSLDecision() {
  const all = await getProposals();
  return all.filter((p) => p.status === "under_gsl_review");
}

export async function getAcceptedProposals() {
  const all = await getProposals();
  return all.filter((p) => p.status === "accepted");
}

export async function getRejectedProposals() {
  const all = await getProposals();
  return all.filter((p) => p.status === "rejected");
}

export async function getUpcomingExecutions(withinDays = 3) {
  return USE_APPWRITE
    ? (await getProposals()).filter((p) => p.status === "accepted" && daysUntil(p.execution_date) >= 0 && daysUntil(p.execution_date) <= withinDays)
    : mockGetUpcomingExecutions(withinDays);
}

// NOTE ON THE 3-DAY ALERT: this scaffold computes "upcoming executions"
// client-side whenever a dashboard renders, which is fine for a demo but
// means the alert only fires while someone has the app open. For
// production, add a scheduled Appwrite Function (e.g. daily cron) that
// queries accepted proposals with execution_date within 3 days and writes
// `notifications` rows server-side, per spec section 9A.6.
