import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/common/Toast";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

import ScoutsList from "./pages/scouts/ScoutsList";
import ScoutForm from "./pages/scouts/ScoutForm";
import ScoutDetail from "./pages/scouts/ScoutDetail";
import Promotions from "./pages/scouts/Promotions";

import ProposalsList from "./pages/proposals/ProposalsList";
import NewProposal from "./pages/proposals/NewProposal";
import ProposalDetail from "./pages/proposals/ProposalDetail";

import Finance from "./pages/finance/Finance";
import NewExpense from "./pages/finance/NewExpense";
import ExpenseDetail from "./pages/finance/ExpenseDetail";
import NewEvent from "./pages/finance/NewEvent";
import EventDetail from "./pages/finance/EventDetail";

import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";

function LoginGate() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginGate />} />

              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/scouts" element={<ScoutsList />} />
                <Route path="/scouts/new" element={<ScoutForm />} />
                <Route path="/scouts/:id" element={<ScoutDetail />} />
                <Route path="/scouts/:id/edit" element={<ScoutForm />} />
                <Route path="/promotions" element={<Promotions />} />

                <Route path="/proposals" element={<ProposalsList />} />
                <Route path="/proposals/new" element={<NewProposal />} />
                <Route path="/proposals/:id" element={<ProposalDetail />} />

                <Route path="/finance" element={<Finance />} />
                <Route path="/finance/expenses/new" element={<NewExpense />} />
                <Route path="/finance/expenses/:id" element={<ExpenseDetail />} />
                <Route path="/finance/events/new" element={<NewEvent />} />
                <Route path="/finance/events/:id" element={<EventDetail />} />

                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
