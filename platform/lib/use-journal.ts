"use client";
import { useEffect, useRef, useState } from "react";
import { EMPTY_JOURNAL, readJournal, type Journal } from "./fitness";
const STORAGE = "gym-engine-personal-v1";
export function useJournal() {
  const [journal, setJournal] = useState<Journal>(EMPTY_JOURNAL),
    [ready, setReady] = useState(false),
    [message, setMessage] = useState("");
  const lastStored = useRef<string | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      setJournal(readJournal(raw));
      lastStored.current = raw;
      setReady(true);
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Storage is unavailable. You can still explore and generate plans.",
      );
    }
  }, []);
  function save(next: Journal) {
    try {
      if (!ready)
        throw new Error(
          "Device storage is unavailable. Nothing has been overwritten.",
        );
      if (localStorage.getItem(STORAGE) !== lastStored.current)
        throw new Error(
          "Your journal changed in another tab. Reload before saving; no records have been overwritten.",
        );
      const raw = JSON.stringify(next);
      localStorage.setItem(STORAGE, raw);
      lastStored.current = raw;
      setJournal(next);
      return true;
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Could not save. Device storage may be full.",
      );
      return false;
    }
  }
  return { journal, ready, message, setMessage, save };
}
