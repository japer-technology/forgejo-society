# Insulation Protocol

Interaction is necessary, but insulation is equally necessary.

Insulation protects independence, prevents drift, and allows structural experimentation without contaminating the live ecology.

---

## Insulation map

The society maintains an insulation map declaring which parts may not share state directly.

Minimum separations:
- worker proposals must not directly edit critic records
- critics must not share mutable prompt state with the workers they challenge
- censors must not derive authority from the proposals they block
- experimental frames, K-lines, and agents must run in branch-isolated or shadow mode before promotion
- structural learning workflows must not write directly to production governance without review

---

## Failure modes this prevents

- over-coupling
- double-purpose deadlock
- uncontrolled shared-state drift
- evaluation contamination

---

## Structural experiment rule

New structural mechanisms run in one of two safe modes first:
- **branch-isolated**: writes only to experiment branches or sandboxes
- **shadow mode**: produces parallel recommendations without affecting live settlements

Promotion requires governance review and explicit comparison to the incumbent path.

---

## Source notes

This protocol is primarily a direct incorporation of Minsky's 1988 emphasis on insulation and protected partial independence.
