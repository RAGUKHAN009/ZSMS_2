import { addDaysISO, todayISO } from "../utils/dateUtils";

export const seedUsers = [
  { id: "u1", user_id: "u1", full_name: "Waqas Baig", email: "gsl@zsms.local", phone: "0300-0000001", designation: "GSL", section: null, active: true },
  { id: "u2", user_id: "u2", full_name: "Farah Iqbal", email: "gs@zsms.local", phone: "0300-0000002", designation: "GS", section: null, active: true },
  { id: "u3", user_id: "u3", full_name: "Hina Yousaf", email: "ssl@zsms.local", phone: "0300-0000003", designation: "SSL", section: "SS", active: true },
  { id: "u4", user_id: "u4", full_name: "Ayesha Noor", email: "assl@zsms.local", phone: "0300-0000004", designation: "ASSL", section: "SS", active: true },
  { id: "u5", user_id: "u5", full_name: "Adeel Raza", email: "sl@zsms.local", phone: "0300-0000005", designation: "SL", section: "BS", active: true },
  { id: "u6", user_id: "u6", full_name: "Kamran Sohail", email: "asl@zsms.local", phone: "0300-0000006", designation: "ASL", section: "BS", active: true },
  { id: "u7", user_id: "u7", full_name: "Bilal Sarwar", email: "rl@zsms.local", phone: "0300-0000007", designation: "RL", section: "RS", active: true },
  { id: "u8", user_id: "u8", full_name: "Usman Tariq", email: "arl@zsms.local", phone: "0300-0000008", designation: "ARL", section: "RS", active: true },
  { id: "u9", user_id: "u9", full_name: "Sana Malik", email: "fs@zsms.local", phone: "0300-0000009", designation: "FS", section: null, active: true },
  { id: "u10", user_id: "u10", full_name: "Imran Qureshi", email: "os@zsms.local", phone: "0300-0000010", designation: "OS", section: null, active: true },
];

export const seedScouts = [
  {
    id: "s1", scout_id: "IDBS-ZG-SS-0001", full_name: "Ahmed Raza", father_name: "Tariq Raza",
    date_of_birth: "2015-03-10", cnic_bform: "35201-0000001-1", contact_number: "0301-1111111",
    emergency_contact: "0301-2222222", blood_group: "O+", section: "SS", status: "active",
    created_by: "u4", current_reviewer: null, created_at: addDaysISO(-120),
  },
  {
    id: "s2", scout_id: "IDBS-ZG-BS-0001", full_name: "Zain Malik", father_name: "Farhan Malik",
    date_of_birth: "2011-06-22", cnic_bform: "35201-0000002-2", contact_number: "0301-3333333",
    emergency_contact: "0301-4444444", blood_group: "A+", section: "BS", status: "under_leader_review",
    created_by: "u6", current_reviewer: "u5", created_at: addDaysISO(-10),
  },
  {
    id: "s3", scout_id: "IDBS-ZG-RS-0001", full_name: "Hamza Sheikh", father_name: "Naveed Sheikh",
    date_of_birth: "2006-01-15", cnic_bform: "35201-0000003-3", contact_number: "0301-5555555",
    emergency_contact: "0301-6666666", blood_group: "B+", section: "RS", status: "active",
    created_by: "u8", current_reviewer: null, created_at: addDaysISO(-300),
  },
  {
    id: "s4", scout_id: "IDBS-ZG-SS-0002", full_name: "Bilal Aslam", father_name: "Aslam Khan",
    date_of_birth: "2012-11-02", cnic_bform: "35201-0000004-4", contact_number: "0301-7777777",
    emergency_contact: "0301-8888888", blood_group: "AB+", section: "SS", status: "under_gs_review",
    created_by: "u4", current_reviewer: "u2", created_at: addDaysISO(-5),
  },
];

export const seedProposals = [
  {
    id: "PR-0001",
    activity_name: "Annual Monsoon Hiking Camp",
    timeline: "Fri 6:00 AM – Sun 5:00 PM (2 nights)",
    execution_date: addDaysISO(2),
    purpose: "Build endurance and outdoor survival skills ahead of the regional jamboree.",
    total_scouts: 34,
    scouts_group: "BS",
    details: "Two-night hiking camp at Kachura trail. Includes tent pitching assessment, night navigation exercise, and a joint campfire with the Rover troop on night two.",
    outcomes: "Improved fitness benchmarks, navigation badge completions, stronger troop cohesion ahead of jamboree.",
    submitted_by: "u5",
    submitting_role: "SL",
    status: "accepted",
    gs_reviewed_by: "u2",
    gsl_decision_by: "u1",
    gsl_comment: "Approved — coordinate transport with GS a week out.",
    executing_leader: "SL",
    created_at: addDaysISO(-6),
  },
  {
    id: "PR-0002",
    activity_name: "Shaheen Craft & Storytelling Day",
    timeline: "Sat 9:00 AM – 1:00 PM",
    execution_date: addDaysISO(10),
    purpose: "Introduce younger scouts to badge-linked craft activities in a low-pressure format.",
    total_scouts: 21,
    scouts_group: "SS",
    details: "Half-day indoor session at the group hall covering knot-craft, flag folding, and a storytelling circle themed around founder history.",
    outcomes: "Craft badge progress, higher SS retention, parent visibility into program quality.",
    submitted_by: "u3",
    submitting_role: "SSL",
    status: "submitted_to_gs",
    created_at: addDaysISO(-1),
  },
  {
    id: "PR-0003",
    activity_name: "River Cleanup Community Service",
    timeline: "Sun 7:00 AM – 12:00 PM",
    execution_date: addDaysISO(14),
    purpose: "Deliver required community-service hours while building local goodwill.",
    total_scouts: 18,
    scouts_group: "RS",
    details: "Riverside cleanup drive in coordination with the municipal sanitation office. Rovers will log waste volumes for a short report to the district office.",
    outcomes: "Community-service hours logged, local press coverage opportunity, district recognition.",
    submitted_by: "u7",
    submitting_role: "RL",
    status: "under_gsl_review",
    gs_reviewed_by: "u2",
    created_at: addDaysISO(-3),
  },
  {
    id: "PR-0004",
    activity_name: "Winter Uniform Drive Kickoff",
    timeline: "Sat 10:00 AM – 11:30 AM",
    execution_date: addDaysISO(20),
    purpose: "Collect donated uniforms ahead of winter for scouts flagged as needing one.",
    total_scouts: 40,
    scouts_group: "BS",
    details: "Short assembly to launch the donation box and brief troop leaders on collection logistics for the next three weeks.",
    outcomes: "Uniform stock for needy scouts, higher parent participation.",
    submitted_by: "u5",
    submitting_role: "SL",
    status: "rejected",
    gs_reviewed_by: "u2",
    gsl_decision_by: "u1",
    gsl_comment: "Overlaps with the hiking camp week — resubmit for a later date.",
    created_at: addDaysISO(-8),
  },
];

export const seedExpenses = [
  {
    id: "e1", expense_number: "EXP-0001", expense_date: addDaysISO(-4), month: new Date().toISOString().slice(0, 7),
    created_by: "u9", status: "under_gs_review", total_amount: 2500, notes: "Office supplies restock",
    items: [
      { id: "ei1", item_name: "Pens", quantity: 20, total_expense: 1000 },
      { id: "ei2", item_name: "Files", quantity: 10, total_expense: 1500 },
    ],
  },
];

export const seedEvents = [
  {
    id: "ev1", event_name: "District Jamboree Prep", event_date: addDaysISO(18), status: "draft", created_by: "u9",
    expenses: [
      { id: "ee1", product_name: "Tents", vendor_name: "Alpine Supplies", total_expense: 24000 },
    ],
  },
];

export const seedNotifications = [
  { id: "n1", recipient_user_id: "u1", type: "proposal_under_review", title: "Proposal awaiting your decision", message: "River Cleanup Community Service was forwarded by GS.", related_record_id: "PR-0003", read: false, created_at: addDaysISO(-3) },
  { id: "n2", recipient_user_id: "u5", type: "proposal_accepted", title: "Proposal accepted", message: "Annual Monsoon Hiking Camp was accepted — you're assigned to execute it.", related_record_id: "PR-0001", read: false, created_at: addDaysISO(-5) },
  { id: "n3", recipient_user_id: "u5", type: "execution_reminder", title: "Activity in 2 days", message: "Annual Monsoon Hiking Camp runs in 2 days.", related_record_id: "PR-0001", read: false, created_at: todayISO() },
];
