window.HAM = window.HAM || {};

HAM.lifecycleEvents = [];

HAM.lifecycleStorageKey =
  "hivewayLifecycleEvents";

HAM.lifecycleMigrationKey =
  "hivewayLifecycleMigrationV1";

HAM.loadLifecycleEvents = function () {
  try {
    const storedEvents = JSON.parse(
      localStorage.getItem(
        HAM.lifecycleStorageKey
      )
    );

    HAM.lifecycleEvents =
      Array.isArray(storedEvents)
        ? storedEvents
        : [];
  } catch (error) {
    console.error(
      "Could not load lifecycle events:",
      error
    );

    HAM.lifecycleEvents = [];
  }
};

HAM.saveLifecycleEvents = function () {
  localStorage.setItem(
    HAM.lifecycleStorageKey,
    JSON.stringify(HAM.lifecycleEvents)
  );
};

HAM.generateLifecycleEventId = function () {
  const highestNumber =
    HAM.lifecycleEvents.reduce(
      (highest, event) => {
        const match = String(
          event.id || ""
        ).match(/^EVT-(\d+)$/);

        if (!match) {
          return highest;
        }

        return Math.max(
          highest,
          Number(match[1])
        );
      },
      0
    );

  return `EVT-${String(
    highestNumber + 1
  ).padStart(6, "0")}`;
};

HAM.addLifecycleEvent = function ({
  assetId,
  type,
  timestamp = new Date().toISOString(),
  performedBy = "",
  description = "",
  metadata = {}
}) {
  if (!assetId) {
    console.error(
      "Lifecycle event requires an assetId."
    );

    return null;
  }

  if (!type) {
    console.error(
      "Lifecycle event requires a type."
    );

    return null;
  }

  const event = {
    id: HAM.generateLifecycleEventId(),
    assetId: String(assetId),
    type: String(type),
    timestamp,
    performedBy: String(
      performedBy || ""
    ),
    description: String(
      description || ""
    ),
    metadata:
      metadata &&
      typeof metadata === "object" &&
      !Array.isArray(metadata)
        ? metadata
        : {}
  };

  HAM.lifecycleEvents.push(event);
  HAM.saveLifecycleEvents();

  return event;
};

HAM.getAssetLifecycle = function (assetId) {
  return HAM.lifecycleEvents
    .filter(
      event => event.assetId === assetId
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );
};

HAM.getRecentActivity = function (
  limit = 20
) {
  return [...HAM.lifecycleEvents]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, limit);
};

HAM.getEventsByType = function (type) {
  return HAM.lifecycleEvents
    .filter(event => event.type === type)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );
};

HAM.getEventsByEmployee = function (
  employeeName,
  employeeEmail = ""
) {
  const normalizedName = String(
    employeeName || ""
  )
    .trim()
    .toLowerCase();

  const normalizedEmail = String(
    employeeEmail || ""
  )
    .trim()
    .toLowerCase();

  return HAM.lifecycleEvents.filter(
    event => {
      const metadata =
        event.metadata || {};

      const values = [
        event.performedBy,
        metadata.employeeName,
        metadata.employeeEmail,
        metadata.fromName,
        metadata.fromEmail,
        metadata.toName,
        metadata.toEmail
      ]
        .filter(Boolean)
        .map(value =>
          String(value)
            .trim()
            .toLowerCase()
        );

      const nameMatches =
        normalizedName &&
        values.some(
          value =>
            value === normalizedName
        );

      const emailMatches =
        normalizedEmail &&
        values.some(
          value =>
            value === normalizedEmail
        );

      return (
        nameMatches ||
        emailMatches
      );
    }
  );
};

HAM.deleteLifecycleEventsForAsset =
  function (assetId) {
    HAM.lifecycleEvents =
      HAM.lifecycleEvents.filter(
        event =>
          event.assetId !== assetId
      );

    HAM.saveLifecycleEvents();
  };

HAM.convertLegacyHistoryItem =
  function (asset, item) {
    const legacyType =
      item.type || "Updated";

    const typeMap = {
      Created: "Created",
      Assigned: "Assigned",
      Transfer: "Transferred",
      Transferred: "Transferred",
      Returned: "Returned",
      Updated: "Updated",
      Deleted: "Deleted"
    };

    const eventType =
      typeMap[legacyType] ||
      legacyType;

    return {
      assetId: asset.id,

      type: eventType,

      timestamp:
        item.date ||
        asset.updatedAt ||
        asset.createdAt ||
        new Date().toISOString(),

      performedBy: "",

      description:
        item.note ||
        `${eventType} event migrated from the legacy history system.`,

      metadata: {
        fromName:
          item.fromName || "",

        fromEmail:
          item.fromEmail || "",

        toName:
          item.toName || "",

        toEmail:
          item.toEmail || ""
      }
    };
  };

HAM.migrateLegacyHistory = function () {
  const migrationComplete =
    localStorage.getItem(
      HAM.lifecycleMigrationKey
    ) === "true";

  if (migrationComplete) {
    return;
  }

  let migratedCount = 0;

  HAM.assets.forEach(asset => {
    const legacyHistory =
      Array.isArray(asset.history)
        ? asset.history
        : [];

    legacyHistory.forEach(item => {
      const convertedEvent =
        HAM.convertLegacyHistoryItem(
          asset,
          item
        );

      const duplicateExists =
        HAM.lifecycleEvents.some(event => {
          return (
            event.assetId ===
              convertedEvent.assetId &&
            event.type ===
              convertedEvent.type &&
            event.timestamp ===
              convertedEvent.timestamp &&
            event.description ===
              convertedEvent.description
          );
        });

      if (!duplicateExists) {
        HAM.addLifecycleEvent(
          convertedEvent
        );

        migratedCount += 1;
      }
    });

    const alreadyHasLifecycleEvents =
      HAM.lifecycleEvents.some(
        event =>
          event.assetId === asset.id
      );

    if (!alreadyHasLifecycleEvents) {
      HAM.addLifecycleEvent({
        assetId: asset.id,

        type: "Created",

        timestamp:
          asset.createdAt ||
          asset.updatedAt ||
          new Date().toISOString(),

        description:
          "Asset record migrated into the lifecycle system.",

        metadata: {
          assetType:
            asset.assetType || "",

          model:
            asset.model || "",

          serialNumber:
            asset.serialNumber || ""
        }
      });

      migratedCount += 1;
    }
  });

  localStorage.setItem(
    HAM.lifecycleMigrationKey,
    "true"
  );

  if (migratedCount > 0) {
    console.info(
      `Migrated ${migratedCount} lifecycle event(s).`
    );
  }
};

HAM.isOwnershipLifecycleEvent =
  function (eventType) {
    return Object.values(
      HAM.OWNERSHIP_EVENT_TYPES || {}
    ).includes(eventType);
  };

HAM.initializeLifecycle = function () {
  HAM.loadLifecycleEvents();
  HAM.migrateLegacyHistory();
};
