# HiveOps

## Hiveway Operations Platform

HiveOps is an internal operations platform developed for Hiveway Inc.

The first application within HiveOps is the **Asset Manager**, a lightweight corporate asset lifecycle system designed to track company equipment, employee assignments, transfers, inventory status, and asset history.

---

## Current Application

### Asset Manager

The Asset Manager tracks assets such as:

- MacBooks
- iPhones
- iPads
- Android phones
- Google Pixel devices
- Stripe development kits
- BBPOS WisePad 3
- BBPOS WisePOS E
- BBPOS WisePOS E docks
- Stripe Reader M2
- Stripe Reader S700
- Stripe Terminal test cards
- Interac test cards
- Other corporate equipment

---

## Current Features

- Corporate asset inventory
- Automatic Hiveway asset ID generation
- Dynamic device model catalog
- Catalog Manager
- Employee assignments
- Asset transfers
- Return-to-inventory workflow
- Assignment and transfer history
- Employee asset reporting
- Asset status reporting
- Asset type reporting
- JSON import and export
- CSV export
- Responsive browser interface
- Modular JavaScript architecture
- Browser-based data persistence

---

## Current Release

**HiveOps Version 3.0 — FOUNDATION**

Version 3.0 introduced the modular application architecture that supports future HiveOps development.

---

## Application Structure

```text
hiveway-asset-tracker/
├── index.html
├── style.css
├── hiveway-_1_.gif
│
├── js/
│   ├── app.js
│   ├── catalog.js
│   ├── config.js
│   ├── inventory.js
│   ├── reports.js
│   ├── storage.js
│   ├── transfer.js
│   └── ui.js
│
├── data/
│   └── assets.json
│
├── README.md
├── ROADMAP.md
├── CHANGELOG.md
└── CONTRIBUTING.md
