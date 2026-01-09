# 1) Prisma Quality Gates

The purpose of this document is to define **quality gates** that every slice/user story must pass before being considered “Done.” This ensures Prisma maintains a high standard of user experience, trustworthiness, and usability as it grows.

## Gate A: Calm + Non-judgmental UX

A slice is not “Done” unless:

- Copy is **neutral and supportive** (no blame/shame language).
- Any warning is phrased as **actionable guidance**, not scolding.
- The default experience is **low cognitive load** (progressive disclosure where relevant).

## Gate B: Empty, Loading, and Error States

A slice is not “Done” unless it has:

- **Empty state** (what it means + what to do next)
- **Loading state** (even if simple)
- **Error state** (plain-language, recovery path)

## Gate C: Safety Rails for Risky Actions

A slice is not “Done” unless:

- Destructive actions (delete, irreversible changes) have **confirmation**.
- Users get **clear feedback** after actions (what changed).
- If feasible, there is **undo/reversal** (or a safe edit path).

## Gate D: Explainability for Guidance & Derived Numbers

A slice is not “Done” unless:

- Any computed/guidance number (e.g., Safe to Spend) has:
  - a **short explanation** in plain language (“based on X and Y”)
  - a **clear assumptions note** (what is included/excluded)
- Degrades gracefully when data is missing (“Add X to improve accuracy”), without blocking.

## Gate E: Data Integrity & Predictability

A slice is not “Done” unless:

- Edits/deletes/updates **do not create silent inconsistencies**.
- Derived views (balances, totals, lists) update in a way that feels **predictable**.
- The user can “reason about” the system: no “magic” behavior.

## Gate F: Mobile Baseline Usability

A slice is not “Done” unless:

- Primary flows are usable on mobile: tap targets, spacing, readability.
- Key actions are reachable without precision taps.
- The UI doesn’t rely solely on color to convey meaning.

# 2) Prisma "Definition of Done"

A slice/story is **Done** only when all items below are true:

1. **Outcome shipped (end-to-end)**
2. **Calm tone (no shame/blame)** (Gate A)
3. **Empty / Loading / Error states** (Gate B)
4. **Confirm + feedback + undo (risky actions)** (Gate C)
5. **Explainable numbers + assumptions (if any)** (Gate D)
6. **Integrity: edits/deletes keep totals consistent** (Gate E)
7. **Mobile-ready (tap targets + readability)** (Gate F)
