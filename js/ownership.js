window.HAM = window.HAM || {};

HAM.OWNERSHIP_MIGRATION_KEY =
  "hivewayOwnershipMigrationV1";

HAM.createDefaultOwnership = function () {
  return {
    version:
      HAM.OWNERSHIP_SCHEMA_VERSION || 1,

    acquisitionType:
      HAM.OWNERSHIP_TYPES.UNKNOWN,

    vendor: "",
    acquisitionDate: "",
    cost: null,

    currency:
      Array.isArray(HAM.CURRENCIES) &&
      HAM.CURRENCIES.includes("CAD")
        ? "CAD"
        : HAM.CURRENCIES[0] || "CAD",

    reference: "",
    notes: "",

    lease: {
      provider: "",
      reference: "",
      startDate: "",
      endDate: "",
      returnDate: "",
      monthlyCost: null,
      residualValue: null,
      status: ""
    }
  };
};

HAM.normalizeOwnershipAmount = function (value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const amount = Number(value);

  return Number.isFinite(amount)
    ? amount
    : null;
};

HAM.ensureOwnership = function (asset) {
  if (
    !asset ||
    typeof asset !== "object" ||
    Array.isArray(asset)
  ) {
    return asset;
  }

  const defaults =
    HAM.createDefaultOwnership();

  const existingOwnership =
    asset.ownership &&
    typeof asset.ownership === "object" &&
    !Array.isArray(asset.ownership)
      ? asset.ownership
      : {};

  const existingLease =
    existingOwnership.lease &&
    typeof existingOwnership.lease === "object" &&
    !Array.isArray(existingOwnership.lease)
      ? existingOwnership.lease
      : {};

  const validOwnershipTypes =
    Object.values(HAM.OWNERSHIP_TYPES);

  const acquisitionType =
    validOwnershipTypes.includes(
      existingOwnership.acquisitionType
    )
      ? existingOwnership.acquisitionType
      : HAM.OWNERSHIP_TYPES.UNKNOWN;

  const currency =
    HAM.CURRENCIES.includes(
      existingOwnership.currency
    )
      ? existingOwnership.currency
      : defaults.currency;

  return {
    ...asset,

    ownership: {
      ...defaults,
      ...existingOwnership,

      version:
        HAM.OWNERSHIP_SCHEMA_VERSION,

      acquisitionType,

      vendor:
        String(
          existingOwnership.vendor || ""
        ),

      acquisitionDate:
        String(
          existingOwnership.acquisitionDate || ""
        ),

      cost:
        HAM.normalizeOwnershipAmount(
          existingOwnership.cost
        ),

      currency,

      reference:
        String(
          existingOwnership.reference || ""
        ),

      notes:
        String(
          existingOwnership.notes || ""
        ),

      lease: {
        ...defaults.lease,
        ...existingLease,

        provider:
          String(
            existingLease.provider || ""
          ),

        reference:
          String(
            existingLease.reference || ""
          ),

        startDate:
          String(
            existingLease.startDate || ""
          ),

        endDate:
          String(
            existingLease.endDate || ""
          ),

        returnDate:
          String(
            existingLease.returnDate || ""
          ),

        monthlyCost:
          HAM.normalizeOwnershipAmount(
            existingLease.monthlyCost
          ),

        residualValue:
          HAM.normalizeOwnershipAmount(
            existingLease.residualValue
          ),

        status:
          String(
            existingLease.status || ""
          )
      }
    }
  };
};

HAM.getAssetOwnership = function (assetOrId) {
  const asset =
    typeof assetOrId === "string"
      ? HAM.assets.find(
          item => item.id === assetOrId
        )
      : assetOrId;

  if (!asset) {
    return null;
  }

  return HAM.ensureOwnership(asset).ownership;
};

HAM.isLeased = function (assetOrId) {
  const ownership =
    HAM.getAssetOwnership(assetOrId);

  return (
    ownership?.acquisitionType ===
    HAM.OWNERSHIP_TYPES.LEASED
  );
};

HAM.isPurchased = function (assetOrId) {
  const ownership =
    HAM.getAssetOwnership(assetOrId);

  return (
    ownership?.acquisitionType ===
    HAM.OWNERSHIP_TYPES.PURCHASED
  );
};

HAM.isOwnershipComplete = function (assetOrId) {
  const ownership =
    HAM.getAssetOwnership(assetOrId);

  if (!ownership) {
    return false;
  }

  if (
    ownership.acquisitionType ===
    HAM.OWNERSHIP_TYPES.UNKNOWN
  ) {
    return false;
  }

  if (
    !ownership.acquisitionDate ||
    !ownership.currency
  ) {
    return false;
  }

  if (
    ownership.acquisitionType ===
    HAM.OWNERSHIP_TYPES.PURCHASED
  ) {
    return Boolean(
      ownership.vendor &&
      ownership.cost !== null
    );
  }

  if (
    ownership.acquisitionType ===
    HAM.OWNERSHIP_TYPES.LEASED
  ) {
    return Boolean(
      ownership.lease.provider &&
      ownership.lease.startDate &&
      ownership.lease.endDate &&
      ownership.lease.status
    );
  }

  return true;
};

HAM.getAssetsWithoutOwnership = function () {
  return HAM.assets.filter(
    asset =>
      !HAM.isOwnershipComplete(asset)
  );
};

HAM.getOwnershipBadgeClass = function (
  acquisitionType
) {
  return String(
    acquisitionType ||
    HAM.OWNERSHIP_TYPES.UNKNOWN
  )
    .trim()
    .replaceAll(" ", "-");
};

HAM.formatMoney = function (
  value,
  currency = "CAD"
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  const numericValue =
    Number(value);

  if (!Number.isFinite(numericValue)) {
    return "";
  }

  try {
    return new Intl.NumberFormat(
      "en-CA",
      {
        style: "currency",
        currency
      }
    ).format(numericValue);
  } catch {
    return `${currency} ${numericValue.toFixed(2)}`;
  }
};

HAM.readOwnershipForm = function () {
  const acquisitionType =
    HAM.getValue("acquisitionType") ||
    HAM.OWNERSHIP_TYPES.UNKNOWN;

  const ownership = {
    version:
      HAM.OWNERSHIP_SCHEMA_VERSION,

    acquisitionType,

    vendor:
      HAM.getValue("ownershipVendor").trim(),

    acquisitionDate:
      HAM.getValue("acquisitionDate"),

    cost:
      HAM.normalizeOwnershipAmount(
        HAM.getValue("ownershipCost")
      ),

    currency:
      HAM.getValue("ownershipCurrency") ||
      "CAD",

    reference:
      HAM.getValue("ownershipReference").trim(),

    notes:
      HAM.getValue("ownershipNotes").trim(),

    lease: {
      provider:
        HAM.getValue("leaseProvider").trim(),

      reference:
        HAM.getValue("leaseReference").trim(),

      startDate:
        HAM.getValue("leaseStartDate"),

      endDate:
        HAM.getValue("leaseEndDate"),

      returnDate:
        HAM.getValue("leaseReturnDate"),

      monthlyCost:
        HAM.normalizeOwnershipAmount(
          HAM.getValue("leaseMonthlyCost")
        ),

      residualValue:
        HAM.normalizeOwnershipAmount(
          HAM.getValue("leaseResidualValue")
        ),

      status:
        HAM.getValue("leaseStatus")
    }
  };

  if (
    acquisitionType !==
    HAM.OWNERSHIP_TYPES.LEASED
  ) {
    ownership.lease =
      HAM.createDefaultOwnership().lease;
  }

  return ownership;
};

HAM.populateOwnershipForm = function (
  assetOrOwnership
) {
  const ownership =
    assetOrOwnership?.ownership
      ? HAM.ensureOwnership(
          assetOrOwnership
        ).ownership
      : {
          ...HAM.createDefaultOwnership(),
          ...(assetOrOwnership || {})
        };

  HAM.setValue(
    "acquisitionType",
    ownership.acquisitionType
  );

  HAM.setValue(
    "ownershipVendor",
    ownership.vendor
  );

  HAM.setValue(
    "acquisitionDate",
    ownership.acquisitionDate
  );

  HAM.setValue(
    "ownershipCost",
    ownership.cost
  );

  HAM.setValue(
    "ownershipCurrency",
    ownership.currency
  );

  HAM.setValue(
    "ownershipReference",
    ownership.reference
  );

  HAM.setValue(
    "ownershipNotes",
    ownership.notes
  );

  HAM.setValue(
    "leaseProvider",
    ownership.lease?.provider
  );

  HAM.setValue(
    "leaseReference",
    ownership.lease?.reference
  );

  HAM.setValue(
    "leaseStartDate",
    ownership.lease?.startDate
  );

  HAM.setValue(
    "leaseEndDate",
    ownership.lease?.endDate
  );

  HAM.setValue(
    "leaseReturnDate",
    ownership.lease?.returnDate
  );

  HAM.setValue(
    "leaseMonthlyCost",
    ownership.lease?.monthlyCost
  );

  HAM.setValue(
    "leaseResidualValue",
    ownership.lease?.residualValue
  );

  HAM.setValue(
    "leaseStatus",
    ownership.lease?.status
  );

  HAM.toggleLeaseFields();
};

HAM.resetOwnershipForm = function () {
  HAM.populateOwnershipForm(
    HAM.createDefaultOwnership()
  );
};

HAM.toggleLeaseFields = function () {
  const leaseFields =
    document.getElementById("leaseFields");

  if (!leaseFields) {
    return;
  }

  const isLeased =
    HAM.getValue("acquisitionType") ===
    HAM.OWNERSHIP_TYPES.LEASED;

  leaseFields.classList.toggle(
    "hidden",
    !isLeased
  );
};

HAM.validateOwnershipForm = function () {
  const ownership =
    HAM.readOwnershipForm();

  if (
    ownership.acquisitionType ===
    HAM.OWNERSHIP_TYPES.LEASED
  ) {
    if (
      !ownership.lease.provider ||
      !ownership.lease.startDate ||
      !ownership.lease.endDate ||
      !ownership.lease.status
    ) {
      return {
        valid: false,

        message:
          "Leased assets require a lease provider, start date, end date, and lease status."
      };
    }

    if (
      new Date(
        ownership.lease.endDate
      ) <
      new Date(
        ownership.lease.startDate
      )
    ) {
      return {
        valid: false,

        message:
          "The lease end date cannot be earlier than the lease start date."
      };
    }
  }

  return {
    valid: true,
    ownership
  };
};

HAM.getOwnershipEventType = function (
  previousOwnership,
  newOwnership
) {
  const previousType =
    previousOwnership?.acquisitionType ||
    HAM.OWNERSHIP_TYPES.UNKNOWN;

  const newType =
    newOwnership?.acquisitionType ||
    HAM.OWNERSHIP_TYPES.UNKNOWN;

  if (
    previousType ===
      HAM.OWNERSHIP_TYPES.UNKNOWN &&
    newType ===
      HAM.OWNERSHIP_TYPES.PURCHASED
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .PURCHASE_RECORDED;
  }

  if (
    previousType !==
      HAM.OWNERSHIP_TYPES.LEASED &&
    newType ===
      HAM.OWNERSHIP_TYPES.LEASED
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .LEASE_STARTED;
  }

  if (
    newType ===
      HAM.OWNERSHIP_TYPES.RENTAL &&
    previousType !== newType
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .RENTAL_STARTED;
  }

  if (
    newType ===
      HAM.OWNERSHIP_TYPES.LOANED &&
    previousType !== newType
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .LOAN_STARTED;
  }

  if (
    newType ===
      HAM.OWNERSHIP_TYPES.VENDOR_EVALUATION &&
    previousType !== newType
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .VENDOR_EVALUATION_STARTED;
  }

  if (
    [
      HAM.OWNERSHIP_TYPES.DEMO,
      HAM.OWNERSHIP_TYPES.CUSTOMER_DEMO
    ].includes(newType) &&
    previousType !== newType
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .DEMO_ASSIGNED;
  }

  if (
    newOwnership?.lease?.status ===
      HAM.LEASE_STATUSES.EXTENDED &&
    previousOwnership?.lease?.status !==
      HAM.LEASE_STATUSES.EXTENDED
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .LEASE_EXTENDED;
  }

  if (
    newOwnership?.lease?.status ===
      HAM.LEASE_STATUSES.PENDING_RETURN &&
    previousOwnership?.lease?.status !==
      HAM.LEASE_STATUSES.PENDING_RETURN
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .LEASE_PENDING_RETURN;
  }

  if (
    newOwnership?.lease?.status ===
      HAM.LEASE_STATUSES.RETURNED &&
    previousOwnership?.lease?.status !==
      HAM.LEASE_STATUSES.RETURNED
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .LEASE_RETURNED;
  }

  if (
    newOwnership?.lease?.status ===
      HAM.LEASE_STATUSES.BUYOUT_COMPLETED &&
    previousOwnership?.lease?.status !==
      HAM.LEASE_STATUSES.BUYOUT_COMPLETED
  ) {
    return HAM.OWNERSHIP_EVENT_TYPES
      .LEASE_BUYOUT_COMPLETED;
  }

  return HAM.OWNERSHIP_EVENT_TYPES
    .OWNERSHIP_UPDATED;
};

HAM.addOwnershipLifecycleEvent = function ({
  assetId,
  type,
  description = "",
  performedBy = "",
  metadata = {}
}) {
  if (
    !HAM.isOwnershipLifecycleEvent(type)
  ) {
    console.warn(
      `Unrecognized ownership lifecycle event type: ${type}`
    );
  }

  return HAM.addLifecycleEvent({
    assetId,
    type,
    description,
    performedBy,

    metadata: {
      category: "Ownership",
      ...metadata
    }
  });
};

HAM.recordOwnershipChange = function ({
  assetId,
  previousOwnership,
  newOwnership,
  isNewAsset = false
}) {
  const previousNormalized =
    previousOwnership ||
    HAM.createDefaultOwnership();

  const newNormalized =
    newOwnership ||
    HAM.createDefaultOwnership();

  if (
    JSON.stringify(previousNormalized) ===
    JSON.stringify(newNormalized)
  ) {
    return null;
  }

  const eventType =
    isNewAsset &&
    newNormalized.acquisitionType ===
      HAM.OWNERSHIP_TYPES.UNKNOWN
      ? HAM.OWNERSHIP_EVENT_TYPES
          .OWNERSHIP_ADDED
      : HAM.getOwnershipEventType(
          previousNormalized,
          newNormalized
        );

  const description =
    eventType ===
      HAM.OWNERSHIP_EVENT_TYPES.LEASE_STARTED
      ? `Lease recorded with ${
          newNormalized.lease.provider ||
          "an unspecified provider"
        }.`
      : eventType ===
          HAM.OWNERSHIP_EVENT_TYPES
            .PURCHASE_RECORDED
        ? `Purchase recorded from ${
            newNormalized.vendor ||
            "an unspecified vendor"
          }.`
        : `Ownership updated to ${newNormalized.acquisitionType}.`;

  return HAM.addOwnershipLifecycleEvent({
    assetId,
    type: eventType,
    description,

    metadata: {
      previousAcquisitionType:
        previousNormalized.acquisitionType,

      acquisitionType:
        newNormalized.acquisitionType,

      vendor:
        newNormalized.vendor,

      acquisitionDate:
        newNormalized.acquisitionDate,

      cost:
        newNormalized.cost,

      currency:
        newNormalized.currency,

      reference:
        newNormalized.reference,

      leaseProvider:
        newNormalized.lease.provider,

      leaseStartDate:
        newNormalized.lease.startDate,

      leaseEndDate:
        newNormalized.lease.endDate,

      leaseStatus:
        newNormalized.lease.status
    }
  });
};

HAM.migrateOwnership = function () {
  let migratedCount = 0;
  let changed = false;

  HAM.assets =
    HAM.assets.map(asset => {
      const hadOwnership =
        asset.ownership &&
        typeof asset.ownership === "object" &&
        !Array.isArray(asset.ownership);

      const originalOwnership =
        hadOwnership
          ? JSON.stringify(
              asset.ownership
            )
          : "";

      const normalizedAsset =
        HAM.ensureOwnership(asset);

      const normalizedOwnership =
        JSON.stringify(
          normalizedAsset.ownership
        );

      if (
        !hadOwnership ||
        originalOwnership !==
          normalizedOwnership
      ) {
        migratedCount += 1;
        changed = true;
      }

      return normalizedAsset;
    });

  if (changed) {
    HAM.saveAssets();
  }

  localStorage.setItem(
    HAM.OWNERSHIP_MIGRATION_KEY,
    "true"
  );

  if (migratedCount > 0) {
    console.info(
      `Ownership initialized for ${migratedCount} asset(s).`
    );
  }

  return migratedCount;
};

HAM.initializeOwnership = function () {
  HAM.migrateOwnership();
};

HAM.initOwnershipUI = function () {
  const acquisitionType =
    document.getElementById(
      "acquisitionType"
    );

  if (!acquisitionType) {
    return;
  }

  acquisitionType.addEventListener(
    "change",
    HAM.toggleLeaseFields
  );

  HAM.resetOwnershipForm();
};
