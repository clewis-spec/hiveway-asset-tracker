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

HAM.normalizeOwnershipAmount =
  function (value) {
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
    typeof existingOwnership.lease ===
      "object" &&
    !Array.isArray(
      existingOwnership.lease
    )
      ? existingOwnership.lease
      : {};

  const validOwnershipTypes =
    Object.values(
      HAM.OWNERSHIP_TYPES
    );

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
          existingOwnership.acquisitionDate ||
          ""
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

HAM.getAssetOwnership = function (
  assetOrId
) {
  const asset =
    typeof assetOrId === "string"
      ? HAM.assets.find(
          item => item.id === assetOrId
        )
      : assetOrId;

  if (!asset) {
    return null;
  }

  const normalizedAsset =
    HAM.ensureOwnership(asset);

  return normalizedAsset.ownership;
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

HAM.isOwnershipComplete = function (
  assetOrId
) {
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

HAM.getAssetsWithoutOwnership =
  function () {
    return HAM.assets.filter(
      asset =>
        !HAM.isOwnershipComplete(asset)
    );
  };

HAM.addOwnershipLifecycleEvent =
  function ({
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

HAM.migrateOwnership = function () {
  let migratedCount = 0;
  let changed = false;

  HAM.assets = HAM.assets.map(asset => {
    const hadOwnership =
      asset.ownership &&
      typeof asset.ownership ===
        "object" &&
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
