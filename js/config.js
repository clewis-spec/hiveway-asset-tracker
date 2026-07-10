window.HAM = window.HAM || {};

HAM.APP_VERSION = "3.2.0";
HAM.OWNERSHIP_SCHEMA_VERSION = 1;

HAM.OWNERSHIP_TYPES = {
  UNKNOWN: "Unknown",
  PURCHASED: "Purchased",
  LEASED: "Leased",
  RENTAL: "Rental",
  DEMO: "Demo",
  LOANED: "Loaned",
  VENDOR_EVALUATION: "Vendor Evaluation",
  INTERNAL_DEVELOPMENT: "Internal Development",
  CUSTOMER_DEMO: "Customer Demo"
};

HAM.LEASE_STATUSES = {
  ACTIVE: "Active",
  EXPIRING_SOON: "Expiring Soon",
  EXTENDED: "Extended",
  PENDING_RETURN: "Pending Return",
  RETURNED: "Returned",
  BUYOUT_COMPLETED: "Buyout Completed"
};

HAM.CURRENCIES = [
  "CAD",
  "USD"
];

HAM.OWNERSHIP_EVENT_TYPES = {
  OWNERSHIP_ADDED: "Ownership Added",
  OWNERSHIP_UPDATED: "Ownership Updated",
  PURCHASE_RECORDED: "Purchase Recorded",
  LEASE_STARTED: "Lease Started",
  LEASE_EXTENDED: "Lease Extended",
  LEASE_PENDING_RETURN: "Lease Pending Return",
  LEASE_RETURNED: "Lease Returned",
  LEASE_BUYOUT_COMPLETED: "Lease Buyout Completed",
  RENTAL_STARTED: "Rental Started",
  LOAN_STARTED: "Loan Started",
  DEMO_ASSIGNED: "Demo Assigned",
  VENDOR_EVALUATION_STARTED: "Vendor Evaluation Started"
};

HAM.defaultAssetCatalog = {
  "MacBook": [
    "MacBook Air 13-inch, M1 (2020)",
    "MacBook Pro 13-inch, M1 (2020)",
    "MacBook Pro 14-inch, M1 Pro (2021)",
    "MacBook Pro 16-inch, M1 Pro (2021)",
    "MacBook Pro 16-inch, M1 Max (2021)",
    "MacBook Air 13-inch, M2 (2022)",
    "MacBook Pro 13-inch, M2 (2022)",
    "MacBook Air 15-inch, M2 (2023)",
    "MacBook Pro 14-inch, M3 (2023)",
    "MacBook Pro 14-inch, M3 Pro (2023)",
    "MacBook Pro 16-inch, M3 Max (2023)",
    "MacBook Air 13-inch, M3 (2024)",
    "MacBook Air 15-inch, M3 (2024)",
    "MacBook Pro 14-inch, M4 (2024)",
    "MacBook Pro 14-inch, M4 Pro (2024)",
    "MacBook Pro 16-inch, M4 Max (2024)",
    "MacBook Pro 14-inch, M5 Pro (2025)",
    "Other MacBook"
  ],

  "iPhone": [
    "iPhone 12",
    "iPhone 12 mini",
    "iPhone 12 Pro",
    "iPhone 12 Pro Max",
    "iPhone 13",
    "iPhone 13 mini",
    "iPhone 13 Pro",
    "iPhone 13 Pro Max",
    "iPhone 14",
    "iPhone 14 Plus",
    "iPhone 14 Pro",
    "iPhone 14 Pro Max",
    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 15 Pro",
    "iPhone 15 Pro Max",
    "iPhone 16",
    "iPhone 16 Plus",
    "iPhone 16 Pro",
    "iPhone 16 Pro Max",
    "iPhone SE 3rd Generation (2022)",
    "Other iPhone"
  ],

  "iPad": [
    "iPad 10th Generation",
    "iPad 11th Generation",
    "iPad Air 4th Generation",
    "iPad Air 5th Generation",
    "iPad Air 11-inch, M2",
    "iPad Air 13-inch, M2",
    "iPad mini 6th Generation",
    "iPad mini 7th Generation",
    "iPad Pro 11-inch, M1",
    "iPad Pro 12.9-inch, M1",
    "iPad Pro 11-inch, M2",
    "iPad Pro 12.9-inch, M2",
    "iPad Pro 11-inch, M4",
    "iPad Pro 13-inch, M4",
    "Other iPad"
  ],

  "Android Phone": [
    "Google Pixel 6",
    "Google Pixel 6 Pro",
    "Google Pixel 6a",
    "Google Pixel 7",
    "Google Pixel 7 Pro",
    "Google Pixel 7a",
    "Google Pixel 8",
    "Google Pixel 8 Pro",
    "Google Pixel 8a",
    "Google Pixel 9",
    "Google Pixel 9 Pro",
    "Google Pixel 9 Pro XL",
    "Google Pixel 9 Pro Fold",
    "Samsung Galaxy S22",
    "Samsung Galaxy S22+",
    "Samsung Galaxy S22 Ultra",
    "Samsung Galaxy S23",
    "Samsung Galaxy S23+",
    "Samsung Galaxy S23 Ultra",
    "Samsung Galaxy S24",
    "Samsung Galaxy S24+",
    "Samsung Galaxy S24 Ultra",
    "Samsung Galaxy S25",
    "Samsung Galaxy S25+",
    "Samsung Galaxy S25 Ultra",
    "Other Android"
  ],

  "BBPOS WisePad 3": [
    "BBPOS WisePad 3"
  ],

  "BBPOS WisePOS E": [
    "BBPOS WisePOS E"
  ],

  "BBPOS WisePOS E Dock": [
    "BBPOS WisePOS E Dock"
  ],

  "Stripe Reader M2": [
    "Stripe Reader M2"
  ],

  "Stripe Reader S700": [
    "Stripe Reader S700"
  ],

  "Stripe Terminal Test Card": [
    "Stripe Terminal Test Card"
  ],

  "Interac Test Card": [
    "Interac Test Card"
  ],

  "Other": [
    "Other"
  ]
};

HAM.assetPrefixes = {
  "MacBook": "HW-MAC",
  "iPad": "HW-IPD",
  "iPhone": "HW-IPH",
  "Android Phone": "HW-AND",
  "BBPOS WisePad 3": "HW-WP3",
  "BBPOS WisePOS E": "HW-WPE",
  "BBPOS WisePOS E Dock": "HW-DOCK",
  "Stripe Reader M2": "HW-M2",
  "Stripe Reader S700": "HW-S700",
  "Stripe Terminal Test Card": "HW-STC",
  "Interac Test Card": "HW-ITC",
  "Other": "HW-OTH"
};
