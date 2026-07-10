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
