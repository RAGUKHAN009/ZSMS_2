import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, ClipboardList, Wallet, BarChart3, Settings, UserCircle, Compass, X, TrendingUp,
} from "lucide-react";
import { navItemsForRole } from "../../utils/permissionUtils";

const ICONS = {
  "/dashboard": LayoutDashboard,
  "/scouts": Users,
  "/proposals": ClipboardList,
  "/finance": Wallet,
  "/promotions": TrendingUp,
  "/reports": BarChart3,
  "/settings": Settings,
  "/profile": UserCircle,
};

export default function Sidebar({ role, open, onClose }) {
  const items = navItemsForRole(role);

  return (
    <>
      {open && <div className="sidebar-scrim no-print" onClick={onClose} />}
      <aside className={`sidebar no-print ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo"><Compass size={18} /></div>
          <div>
            <div className="sidebar-brand-name">ZSMS</div>
            <div className="sidebar-brand-sub">Zulfiqarabad Scouts</div>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => {
            const Icon = ICONS[item.to] || LayoutDashboard;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <style>{`
          .sidebar {
            width: var(--sidebar-width);
            background: var(--surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            padding: 18px 12px;
            position: sticky;
            top: 0;
            height: 100vh;
            flex-shrink: 0;
          }
          .sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 6px 8px 20px; position: relative; }
          .sidebar-logo { width: 34px; height: 34px; border-radius: 9px; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .sidebar-brand-name { font-weight: 800; font-size: 14px; }
          .sidebar-brand-sub { font-size: 11px; color: var(--text-muted); }
          .sidebar-close { display: none; margin-left: auto; background: none; border: none; color: var(--text-muted); }
          .sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
          .sidebar-link {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px; border-radius: 9px; font-size: 13.5px; font-weight: 600;
            color: var(--text-muted);
          }
          .sidebar-link:hover { background: var(--surface-soft); color: var(--text); }
          .sidebar-link.active { background: var(--primary-soft); color: var(--primary); }
          .sidebar-scrim { display: none; }

          @media (max-width: 768px) {
            .sidebar {
              position: fixed;
              left: 0; top: 0;
              width: 260px;
              transform: translateX(-100%);
              transition: transform .2s ease;
              z-index: 60;
            }
            .sidebar-open { transform: translateX(0); }
            .sidebar-close { display: block; }
            .sidebar-scrim {
              display: block; position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 55;
            }
          }
        `}</style>
      </aside>
    </>
  );
}
