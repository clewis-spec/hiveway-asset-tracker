# HiveOps Sprint 3.2 — OWNERSHIP

## Release

HiveOps v3.2.0

## Codename

OWNERSHIP

## Status

Design Approved

---

# Goal

Introduce a standardized ownership and acquisition model for every HiveOps asset.

This release will track how each asset entered Hiveway, including purchased, leased, rental, demo, loaned, evaluation, and internally designated equipment.

Leasing will be implemented as a specialized ownership workflow rather than as an isolated feature.

---

# Approved Acquisition Types

- Unknown
- Purchased
- Leased
- Rental
- Demo
- Loaned
- Vendor Evaluation
- Internal Development
- Customer Demo

Existing assets will default to `Unknown`.

HiveOps will not infer ownership type from the asset category because doing so could create inaccurate financial and contractual records.

---

# Currency

Each asset may use its own currency.

Supported currencies for this release:

- CAD
- USD

---

# Ownership Data Model

Every asset may contain an `ownership` object.

```javascript
ownership: {
  acquisitionType: "Unknown",
  vendor: "",
  acquisitionDate: "",
  cost: "",
  currency: "CAD",
  reference: "",
  notes: "",

  lease: {
    provider: "",
    reference: "",
    startDate: "",
    endDate: "",
    returnDate: "",
    monthlyCost: "",
    residualValue: "",
    status: ""
  }
}
