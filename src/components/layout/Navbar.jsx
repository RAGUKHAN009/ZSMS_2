import React, { useEffect, useState } from "react";
import { Menu, Sun, Moon, Bell, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getNotifications } from "../../services/notificationService";
import { useMockCollection } from "../../hooks/useMockCollection";

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const allNotifications = useMockCollection("notifications");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    getNotifications(user.id).then((rows) => setCount(rows.filter((n) => !n.read).length));
  }, [user, allNotifications]);

  return (
    <header className="navbar no-print">
      <button className="icon-btn mobile-only" onClick={onMenuClick} aria-label="Open menu"><Menu size={20} /></button>

      <div className="navbar-title">
        <div className="navbar-role">{user?.designation}</div>
        <div className="navbar-name">{user?.full_name}</div>
      </div>

      <div className="navbar-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="icon-btn" aria-label="Notifications" style={{ position: "relative" }}>
          <Bell size={18} />
          {count > 0 && <span className="notif-dot">{count}</span>}
        </button>
        <button className="icon-btn" onClick={logout} aria-label="Log out"><LogOut size={18} /></button>
      </div>

      <style>{`
        .navbar {
          height: var(--navbar-height);
          display: flex; align-items: center; gap: 14px;
          padding: 0 20px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          position: sticky; top: 0; z-index: 40;
        }
        .navbar-title { display: flex; flex-direction: column; }
        .navbar-role { font-size: 10.5px; font-weight: 800; letter-spacing: .5px; color: var(--primary); text-transform: uppercase; }
        .navbar-name { font-size: 13.5px; font-weight: 700; }
        .navbar-actions { margin-left: auto; display: flex; align-items: center; gap: 6px; }
        .icon-btn {
          border: none; background: transparent; color: var(--text-muted);
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .icon-btn:hover { background: var(--surface-soft); color: var(--text); }
        .notif-dot {
          position: absolute; top: 3px; right: 3px; background: var(--danger); color: #fff;
          font-size: 9px; font-weight: 800; min-width: 15px; height: 15px; border-radius: 999px;
          display: flex; align-items: center; justify-content: center; padding: 0 3px;
        }
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .mobile-only { display: flex; }
        }
      `}</style>
    </header>
  );
}
