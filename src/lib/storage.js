// A small persistence layer with the same async get/set/delete shape you'd
// get from a real backend (or Supabase). Today it's backed by localStorage,
// which is enough for a single-browser demo. When Stage 4 (database) lands,
// only this file needs to change — swap the bodies below for real API calls
// and every component that calls `storage.get/set/delete` keeps working.

const PREFIX = "finmind:";

export const storage = {
  async get(key) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      if (raw === null) return null;
      return { key, value: raw };
    } catch {
      return null;
    }
  },

  async set(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, value);
      return { key, value };
    } catch {
      return null;
    }
  },

  async delete(key) {
    try {
      window.localStorage.removeItem(PREFIX + key);
      return { key, deleted: true };
    } catch {
      return null;
    }
  },
};
