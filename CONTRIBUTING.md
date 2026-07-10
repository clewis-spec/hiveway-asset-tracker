# Contributing to HiveOps

HiveOps is an internal Hiveway operations platform.

This document describes the development workflow used to maintain the application safely and consistently.

---

## Core Development Principles

### 1. One Responsibility Per Module

Each JavaScript file should focus on one area of the application.

Examples:

```text
catalog.js
Manages:

Device models
Model dropdowns
Catalog Manager
Catalog imports and exports
inventory.js

Manages:

Adding assets
Editing assets
Deleting assets
Returning assets
Inventory rendering
transfer.js

Manages:

Employee transfers
Transfer records
Transfer form behavior
2. Complete File Replacements

When making substantial changes, provide and review the complete affected file rather than relying on small code fragments.

This reduces:

Missing brackets
Incorrect insertion locations
Duplicate functions
Partial feature implementations
Copy-and-paste errors
3. One Major Feature Per Sprint

Each sprint should focus on one major capability.

Examples:

Lifecycle
Leasing
Warranty
Repairs
Employee Directory
QR Codes
Shared Storage
Jamf Integration
4. Preserve Existing Functionality

A new feature should not remove or break existing capabilities unless the change is explicitly planned.

Before merging a feature, test:

Inventory
Reports
Transfers
Catalog
Import and export
Mobile layout
Sprint Workflow
Step 1: Define the Goal

Document:

Problem being solved
Intended user
Required functionality
Files expected to change
Step 2: Build

Create or update the required modules.

Step 3: Commit

Use a descriptive commit message.

Good examples:

Add lifecycle activity feed
Add lease expiry reporting
Fix MacBook model dropdown
Refactor storage module

Avoid vague messages such as:

Update
Changes
Fix stuff
Step 4: Deploy

Wait for the GitHub Pages workflow to show a green checkmark.

Step 5: Hard Refresh

On macOS:

Command + Shift + R
Step 6: Test

Complete the sprint test checklist.

Step 7: Document

Update:

CHANGELOG.md
ROADMAP.md
README.md

when applicable.

Required Testing Checklist

After any major release, verify:

Application Loading
Page loads without visible errors.
Styling loads correctly.
Logo loads correctly.
Browser console contains no JavaScript errors.
Inventory
Asset type dropdown works.
Model dropdown populates.
Asset can be added.
Asset can be edited.
Asset can be deleted.
Duplicate serial numbers are rejected.
Search works.
Reports
Reports tab opens.
Employee totals are correct.
Status totals are correct.
Asset type totals are correct.
Employee drill-down works.
Transfers
Transfer tab opens.
Asset list populates.
Asset can be transferred.
New employee assignment is saved.
Transfer history is created.
Asset can be returned to inventory.
Catalog
Catalog tab opens.
Models appear.
New model can be added.
Duplicate model is rejected.
Model can be deleted.
Catalog survives page refresh.
Catalog export works.
Catalog import works.
Export and Import
Asset JSON export works.
Asset CSV export works.
Asset JSON import works.
Imported assets display correctly.
JavaScript Namespace

HiveOps uses the global namespace:

window.HAM

All application functions and shared application data should be attached to HAM.

Example:

HAM.renderAssets = function () {
  // function logic
};

Avoid adding unrelated global variables or global functions.

Module Load Order

The JavaScript files must load in dependency order:

<script src="js/config.js"></script>
<script src="js/storage.js"></script>
<script src="js/ui.js"></script>
<script src="js/catalog.js"></script>
<script src="js/reports.js"></script>
<script src="js/transfer.js"></script>
<script src="js/inventory.js"></script>
<script src="js/app.js"></script>

Do not reorder these files without reviewing their dependencies.

Data Safety

HiveOps currently uses browser localStorage.

Before any major storage or data-model change:

Export asset JSON.
Export catalog JSON.
Save both files securely.
Perform the update.
Test imported backups if necessary.

Never assume browser data can be recovered after localStorage is cleared.

Security

Do not place the following directly in client-side JavaScript:

Passwords
Private API keys
GitHub personal access tokens
Jamf credentials
Private customer information
Authentication secrets

Anything included in a GitHub Pages application may be visible to site visitors.

Coding Style
Use clear function names.
Prefer const unless reassignment is required.
Use let only when values must change.
Keep functions focused.
Avoid duplicate logic.
Handle missing elements safely.
Validate user input.
Confirm destructive actions.
Preserve asset history.
Escape user-generated content where practical.
Release Naming

HiveOps releases follow this format:

Major.Minor — CODENAME

Examples:

3.0 — FOUNDATION
3.1 — LIFECYCLE
3.2 — LEASING
3.3 — WARRANTY
Internal Ownership

HiveOps is developed for Hiveway Inc.

Changes should support real Hiveway operational workflows and reduce manual administrative effort.


Commit message:

```text
Document HiveOps development workflow
