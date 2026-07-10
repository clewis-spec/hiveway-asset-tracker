# HiveOps Roadmap

## Hiveway Operations Platform

This roadmap documents the planned development of HiveOps and its Asset Manager application.

The roadmap may change as operational priorities evolve.

---

# Current Release

## Version 3.0 — FOUNDATION

Status: Complete

### Delivered

- Modular JavaScript architecture
- Inventory management
- Dynamic model catalog
- Catalog Manager
- Employee assignments
- Asset transfers
- Return-to-inventory workflow
- Employee reporting
- Status reporting
- Asset type reporting
- Asset history
- JSON import and export
- CSV export
- Responsive interface
- GitHub Pages deployment

---

# Version 3.1 — LIFECYCLE

Status: Planned

## Goal

Create a standardized lifecycle engine that records the full history of every asset.

## Planned Features

- Standardized lifecycle events
- Asset activity timeline
- Recent activity dashboard
- Asset creation events
- Assignment events
- Transfer events
- Return events
- Retirement events
- Lost and recovered events
- Improved asset history presentation
- Migration from legacy `history` records to lifecycle events

---

# Version 3.2 — LEASING

Status: Planned

## Goal

Track leased assets from acquisition through return.

## Planned Features

- Owned versus leased designation
- Lease provider
- Lease reference number
- Lease start date
- Lease expiry date
- Lease return date
- Active lease status
- Lease extension tracking
- Returned-after-lease status
- Upcoming lease expiry report
- Lease return workflow
- Lease lifecycle events
- Expiry highlighting for 30-, 60-, and 90-day windows

---

# Version 3.3 — WARRANTY

Status: Planned

## Goal

Track warranty and support coverage for company equipment.

## Planned Features

- Warranty provider
- Coverage type
- Warranty start date
- Warranty expiry date
- AppleCare tracking
- Google device coverage
- Vendor support plans
- Upcoming warranty expiry report
- Warranty lifecycle events
- Warranty status badges

---

# Version 3.4 — REPAIRS

Status: Planned

## Goal

Track asset condition, repair activity, and service history.

## Planned Features

- Asset condition
- Repair started
- Waiting for parts
- Repair completed
- Repair vendor
- Repair cost
- Repair notes
- Repeat repair reporting
- Repair lifecycle timeline
- Asset health indicator

---

# Version 3.5 — EMPLOYEES

Status: Planned

## Goal

Create a managed employee directory for assignments and reporting.

## Planned Features

- Employee directory
- Employee dropdowns
- Email auto-population
- Department
- Manager
- Office location
- Employment status
- Employee asset profile
- Department-level asset reports
- Offboarding asset checklist

---

# Version 3.6 — ASSET PROFILES

Status: Planned

## Goal

Give every asset a dedicated detailed record.

## Planned Features

- Dedicated asset profile page
- General asset information
- Assignment details
- Lifecycle timeline
- Lease information
- Warranty information
- Repair history
- Notes
- Related documents
- Asset QR code
- Printable asset label

---

# Version 3.7 — QR

Status: Planned

## Goal

Allow assets to be opened and managed by scanning a QR code.

## Planned Features

- QR code generation
- Printable labels
- QR-based asset lookup
- Mobile asset view
- Fast transfer and return workflows

---

# Version 3.8 — SHARED DATA

Status: Planned

## Goal

Replace browser-only storage with shared persistent storage.

## Planned Features

- Shared asset database
- Multi-user inventory
- Centralized catalog
- Data backup
- Audit logging
- User identification
- Safer concurrent updates
- Role-based permissions

Potential implementation options:

- GitHub-backed JSON
- Supabase
- Firebase
- Managed relational database

---

# Version 3.9 — EXECUTIVE DASHBOARD

Status: Planned

## Goal

Provide management-level reporting and asset intelligence.

## Planned Features

- Total asset value
- Assets by department
- Assets by employee
- Assets by type
- Owned versus leased
- Lease expirations
- Warranty expirations
- Repairs
- Lost assets
- Retired assets
- Acquisition trends
- Interactive charts

---

# Version 4.0 — JAMF

Status: Future

## Goal

Integrate HiveOps with Jamf for managed Apple device intelligence.

## Planned Features

- Match devices by serial number
- Computer name
- Assigned user
- macOS version
- Last inventory update
- Last check-in
- FileVault status
- Recovery key escrow status
- Bootstrap token status
- Battery health
- Managed state
- Compliance status

---

# Future HiveOps Applications

HiveOps may eventually expand beyond asset management.

Potential applications include:

- Contract Manager
- Sales Pipeline Manager
- Jamf Operations Center
- Stripe Device Fleet Manager
- Corporate Knowledge Hub
- Procurement Manager
- Vendor Manager
- Executive Operations Dashboard
- Internal AI Assistant
