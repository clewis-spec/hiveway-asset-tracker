# HiveOps Changelog

All notable changes to HiveOps are documented in this file.

---

## Version 3.0 — FOUNDATION

### Added

- HiveOps modular JavaScript architecture
- Separate application modules for:
  - Configuration
  - Storage
  - User interface
  - Inventory
  - Catalog
  - Transfers
  - Reports
  - Application startup
- Dynamic asset model dropdown
- Catalog Manager
- Custom catalog model creation
- Catalog model deletion
- Catalog JSON import
- Catalog JSON export
- Reset-to-default catalog workflow
- Employee asset assignments
- Employee email tracking
- Asset transfer workflow
- Return-to-inventory workflow
- Assignment and transfer history
- Asset history view
- Inventory search
- Asset status badges
- Automatic Hiveway asset IDs
- Reports by employee
- Reports by status
- Reports by asset type
- Inventory JSON import
- Inventory JSON export
- Inventory CSV export
- Responsive interface
- GitHub Pages deployment

### Changed

- Renamed the broader platform concept to HiveOps.
- Refactored the original single-file JavaScript application into smaller modules.
- Improved application maintainability and feature isolation.
- Moved catalog management from direct source-code edits into the application interface.

### Storage

- Asset data continues to use browser localStorage.
- Catalog data continues to use browser localStorage.

### Known Limitations

- Data is browser-specific.
- Data is not yet shared between users.
- Clearing browser storage may remove local application data.
- No authentication or role-based access control.
- Asset and catalog changes do not automatically update repository JSON files.

---

## Version 2.6 — CATALOG

### Added

- Catalog Manager tab
- Dynamic MacBook model catalog
- Dynamic iPhone model catalog
- Dynamic iPad model catalog
- Dynamic Android device catalog
- Google Pixel models
- Samsung Galaxy models
- Stripe and BBPOS hardware catalog
- Catalog import and export
- Catalog persistence using localStorage

---

## Version 2.4 — TRANSFER

### Added

- Transfer tab
- Employee-to-employee asset transfers
- Transfer notes
- Assignment history
- Employee asset drill-down
- Return-to-inventory workflow

---

## Version 2.1 — REPORTS

### Added

- Reports tab
- Assets by employee
- Assets by status
- Assets by type
- Edit asset workflow
- Duplicate serial number protection
- JSON import
- Empty inventory state

---

## Version 2.0 — DASHBOARD

### Added

- Hiveway branding
- Logo header
- Dashboard summary cards
- Automatic asset IDs
- Asset categories
- Status badges
- Improved inventory table
- Mobile-responsive layout

---

## Version 1.0 — INITIAL RELEASE

### Added

- Basic asset creation form
- Local browser storage
- Inventory table
- Inventory search
- Asset deletion
- JSON export
- CSV export
- GitHub Pages hosting
