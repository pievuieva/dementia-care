# DementiaCare 🌿

A caregiver operations dashboard for families and carers navigating dementia. Built entirely for the carer — not the person with dementia. The core belief: when the carer is supported, the person they care for is better cared for.

---

## Status

**Active development.** This is v2.2 — the current primary project. All new features and improvements go here.

---

## What It Does

Four-tab app designed for daily use by caregivers:

| Tab | Purpose |
|-----|---------|
| 🏠 Dashboard | Daily mood check-in, care stage selector, Song of the Day, quick stats |
| 📋 Transition Planner | Care milestone checklist across Early / Middle / Late stages (legal, medical, financial, home, care) |
| 💛 Nudge Cards | 8 small connection activities — things to do together that take 2–5 minutes and need no preparation |
| 🌬️ 5-Min Reset | Guided self-care session for the carer: 5 steps × 1 minute, with countdown timer |

### Design philosophy
- The carer is the only user. No patient-facing UI.
- Zero guesswork — the app tells you what to do right now
- Emotional weight of caregiving is acknowledged, not ignored
- Works in a stressful moment with one hand free

---

## Who It's For

- Family members providing daily care at home
- Adult children managing a parent's care
- Paid carers and care home staff
- Anyone navigating Early → Middle → Late stage dementia care

---

## Tech Stack

- React 18
- Vite
- Google Fonts: Lora (headings) + DM Sans (body)
- Pure inline styles (no CSS framework)
- Single-file component (`src/App.jsx`)
- No backend — all state is in-memory

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Files & Memory

Full context, decisions, and session history live in the shared project folder:

```
/Dementia-App-Files/Memory/
  GROUND-TRUTH-dementia-care.md   ← Start here. Full project context for this app.
  GROUND-TRUTH.md                 ← Context for the Love Life companion project
  progress-log.md                 ← Running log of all sessions and decisions
```

**For new Claude sessions:** Read `GROUND-TRUTH-dementia-care.md` before touching any code.

---

## What's Not Built Yet (Next Priorities)

| Feature | Notes |
|---------|-------|
| Persistence | Everything resets on page refresh — needs localStorage or a backend |
| Real user profile | "Caregiver" and care recipient name are hardcoded |
| Live task tracking | "3 of 5 tasks" is a placeholder |
| Day counter | "Day 847" is a placeholder — needs a start date stored |
| Real song playback | Song of the Day shows info only, no audio |
| Backend | Supabase or Firebase when ready to persist data across devices |

---

## Related Project

**[love-life](https://github.com/pievuieva/love-life)** — an earlier exploration of the same problem space, focused on music therapy as the primary intervention. Kept as a reference. Features worth considering for future merge: Memory Lane song library, Ritual Playlists, the 5-tab music therapy structure.
