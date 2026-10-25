"use client";
import { useEffect, useRef, useState } from "react";
import { EMPTY_JOURNAL, readJournal, type Journal } from "./fitness";
export function useJournal() {
  const [journal, setJournal] = useState<Journal>(EMPTY_JOURNAL),
    [ready, setReady] = useState(false),
    [message, setMessage] = useState(""),
    [signedIn, setSignedIn] = useState(false);
  const revision = useRef(0),
    saving = useRef(false);
  useEffect(() => {
    let active = true;
    fetch("/api/journal", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!active) return;
        if (!r.ok) {
          setMessage(d.error || "Sign in to save your personal records.");
          return;
        }
        setJournal(readJournal(JSON.stringify(d.journal)));
        revision.current = d.revision;
        setSignedIn(true);
        setReady(true);
      })
      .catch(() => {
        if (active)
          setMessage("Personal records could not be loaded. Try reloading.");
      });
    return () => {
      active = false;
    };
  }, []);
  async function save(next: Journal) {
    if (saving.current) {
      setMessage("A save is in progress. Please wait.");
      return false;
    }
    saving.current = true;
    setReady(false);
    try {
      if (!ready)
        throw new Error(
          "Sign in to save your records. One-time planning remains free.",
        );
      const r = await fetch("/api/journal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journal: next, revision: revision.current }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not save records.");
      revision.current = d.revision;
      setJournal(next);
      return true;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save records.");
      return false;
    } finally {
      saving.current = false;
      setReady(signedIn);
    }
  }
  return { journal, ready, message, setMessage, save, signedIn };
}
