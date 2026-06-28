/* ═══════════════════════════════════════════════════════════════════
   COUCHE DE DONNÉES — Team Rando
   Expose window.DB avec une API simple :
     DB.mode                  'firebase' | 'local'
     DB.watch(path, cb)  →    écoute en temps réel (cb reçoit la valeur)
     DB.get(path)        →    Promise(valeur)
     DB.push(path, val)  →    Promise(clé générée)
     DB.set(path, val)   →    Promise
     DB.update(path, v)  →    Promise
     DB.remove(path)     →    Promise

   Si firebase-config.js n'est pas rempli → mode LOCAL (localStorage),
   sinon → Firebase Realtime Database (partagé entre tous).
   ═══════════════════════════════════════════════════════════════════ */

const CFG = window.TEAM_RANDO_FIREBASE || {};
const CONFIGURED = CFG.apiKey && CFG.apiKey !== "COLLER_ICI" && CFG.databaseURL && CFG.databaseURL !== "COLLER_ICI";

function announceReady() {
  window.__DB_READY = true;
  window.dispatchEvent(new Event("db-ready"));
}

/* ─────────────────────────────  MODE FIREBASE  ───────────────────── */
async function initFirebase() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const { getDatabase, ref, onValue, push, set, update, remove, get } =
    await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js");
  const { getAuth, signInAnonymously } =
    await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");

  const app  = initializeApp(CFG);
  const db   = getDatabase(app);
  const auth = getAuth(app);
  try { await signInAnonymously(auth); } catch (e) { console.warn("Auth anonyme:", e); }

  window.DB = {
    mode: "firebase",
    watch(path, cb) { return onValue(ref(db, path), snap => cb(snap.val())); },
    get(path)       { return get(ref(db, path)).then(s => s.val()); },
    push(path, val) { const r = push(ref(db, path)); return set(r, val).then(() => r.key); },
    set(path, val)  { return set(ref(db, path), val); },
    update(path, v) { return update(ref(db, path), v); },
    remove(path)    { return remove(ref(db, path)); }
  };
  announceReady();
}

/* ─────────────────────────────  MODE LOCAL  ──────────────────────── */
function initLocal() {
  const KEY = "team_rando_db";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = (o) => localStorage.setItem(KEY, JSON.stringify(o));

  const parts = (p) => p.split("/").filter(Boolean);
  function getAt(root, path) {
    let cur = root;
    for (const k of parts(path)) { if (cur == null) return null; cur = cur[k]; }
    return cur === undefined ? null : cur;
  }
  function setAt(root, path, val) {
    const ks = parts(path);
    if (ks.length === 0) return val;
    let cur = root;
    for (let i = 0; i < ks.length - 1; i++) {
      if (typeof cur[ks[i]] !== "object" || cur[ks[i]] === null) cur[ks[i]] = {};
      cur = cur[ks[i]];
    }
    if (val === null) delete cur[ks[ks.length - 1]];
    else cur[ks[ks.length - 1]] = val;
    return root;
  }

  const watchers = [];
  function notify() { watchers.forEach(w => { try { w.cb(getAt(load(), w.path)); } catch {} }); }

  // Synchronise entre onglets ouverts
  window.addEventListener("storage", e => { if (e.key === KEY) notify(); });

  let counter = 0;
  const genKey = () => "loc-" + Date.now().toString(36) + "-" + (counter++).toString(36) + Math.random().toString(36).slice(2, 6);

  window.DB = {
    mode: "local",
    watch(path, cb) {
      const w = { path, cb };
      watchers.push(w);
      Promise.resolve().then(() => cb(getAt(load(), path)));
      return () => { const i = watchers.indexOf(w); if (i >= 0) watchers.splice(i, 1); };
    },
    get(path) { return Promise.resolve(getAt(load(), path)); },
    push(path, val) {
      const key = genKey();
      const root = load();
      setAt(root, path + "/" + key, val);
      save(root); notify();
      return Promise.resolve(key);
    },
    set(path, val)  { const r = load(); setAt(r, path, val); save(r); notify(); return Promise.resolve(); },
    update(path, v) {
      const r = load();
      Object.keys(v || {}).forEach(k => setAt(r, path + "/" + k, v[k]));
      save(r); notify(); return Promise.resolve();
    },
    remove(path) { const r = load(); setAt(r, path, null); save(r); notify(); return Promise.resolve(); }
  };
  announceReady();
}

/* ─────────────────────────────  DÉMARRAGE  ───────────────────────── */
if (CONFIGURED) {
  initFirebase().catch(err => { console.error("Firebase KO, bascule en local:", err); initLocal(); });
} else {
  initLocal();
}
