import { useEffect, useState } from "react";
import { getState, subscribe } from "../data/mockDb";

// Convenience hook for pages that read straight from the mock DB (used
// while VITE_USE_APPWRITE=false). It just re-renders whenever any mock
// collection changes — fine at this app's scale. Once you're on real
// Appwrite, prefer calling the relevant *Service.js function inside a
// useEffect + Appwrite Realtime subscription instead.
export function useMockCollection(name) {
  const [rows, setRows] = useState(() => getState()[name]);

  useEffect(() => subscribe((state) => setRows(state[name])), [name]);

  return rows;
}
