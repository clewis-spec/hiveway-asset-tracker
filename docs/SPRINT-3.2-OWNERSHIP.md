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
General Ownership Fields

These fields apply to all asset types:

Acquisition Type
Vendor
Acquisition Date
Purchase Price or Asset Cost
Currency
Purchase Order, Invoice, or Reference
Ownership Notes
Lease Fields

These fields are displayed when Acquisition Type is Leased:

Lease Provider
Lease Reference
Lease Start Date
Lease End Date
Lease Return Date
Monthly Cost
Residual Value
Lease Status
Approved Lease Statuses
Active
Expiring Soon
Extended
Pending Return
Returned
Buyout Completed
Lifecycle Events

The ownership engine will create lifecycle events when applicable.

Supported ownership lifecycle events:

Ownership Added
Ownership Updated
Purchase Recorded
Lease Started
Lease Extended
Lease Pending Return
Lease Returned
Lease Buyout Completed
Rental Started
Loan Started
Demo Assigned
Vendor Evaluation Started

Each lifecycle event will reference the related asset ID.
Existing Asset Migration

Existing assets will receive:

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

No existing asset will be automatically classified as purchased or leased.

A future bulk-update workflow may allow administrators to classify multiple assets at once.

User Interface Plan
Inventory Form

Add a new Ownership section containing:

Acquisition Type
Vendor
Acquisition Date
Cost
Currency
Reference
Notes

When Acquisition Type is Leased, show the Lease section.

Inventory Table

Display a concise ownership indicator:

Purchased
Leased
Rental
Demo
Loaned
Unknown
Reports

Add:

Assets by Acquisition Type
Assets with Ownership Not Set
Leased Assets
Upcoming Lease Expirations
Returned Leases
Buyout Completed
Dashboard

Future dashboard cards may include:

Purchased Assets
Leased Assets
Ownership Not Set
Upcoming Lease Expirations
Monthly Lease Cost
Story Breakdown
Story 1 — Ownership Engine
Add js/ownership.js
Add ownership defaults
Migrate existing assets safely
Add ownership helper functions
Add ownership lifecycle-event support
No major visual changes
Story 2 — Ownership User Interface
Add ownership fields to the asset form
Add conditional lease fields
Add ownership badges to inventory
Support editing ownership details
Story 3 — Lease Dashboard
Add lease reporting
Add expiry calculations
Add 30-, 60-, and 90-day lease windows
Add lease return workflow
Add buyout-completed workflow
Story 4 — Financial Reporting
Total asset cost
Cost by acquisition type
Cost by currency
Monthly lease cost
Cost by vendor
Cost by asset type
Files Expected to Change
Story 1
js/config.js
js/storage.js
js/lifecycle.js
js/ownership.js
js/app.js
Story 2
index.html
style.css
js/inventory.js
js/ownership.js
Story 3
index.html
style.css
js/reports.js
js/ownership.js
js/lifecycle.js
Acceptance Criteria

Story 1 is complete when:

Existing assets load without errors.
Existing assets receive an ownership object.
Existing assets default to Unknown.
New assets receive ownership defaults.
Ownership helper functions work.
Lifecycle events support ownership event types.
Existing inventory, reports, transfer, catalog, and lifecycle functionality remain operational.
Browser console contains no red errors.
Ownership data survives refresh.
Test Plan
Load the existing inventory.
Verify all existing assets remain visible.
Verify ownership defaults are added.
Refresh the page.
Verify ownership defaults persist.
Add a new asset.
Verify the new asset receives ownership defaults.
Transfer the asset.
Return the asset.
Verify lifecycle behavior still works.
Verify Reports, Transfer, and Catalog tabs remain operational.
Confirm no console errors.
Future Enhancements
Editable vendor catalog
Purchase order attachment
Invoice attachment
Lease-document attachment
Automatic lease-expiry notifications
Lease renewal workflow
Depreciation calculations
Current asset value
Procurement workflow
Finance dashboard
