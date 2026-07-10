window.HAM = window.HAM || {};

HAM.assetPrefix = function (type) {
  return (
    HAM.assetPrefixes[type] ||
    "HW-AST"
  );
};

HAM.generateAssetId = function (type) {
  const prefix =
    HAM.assetPrefix(type);

  const usedNumbers =
    HAM.assets
      .filter(asset => {
        return (
          asset.id &&
          asset.id.startsWith(
            `${prefix}-`
          )
        );
      })
      .map(asset => {
        const match =
          asset.id.match(
            /-(\d+)$/
          );

        return match
          ? Number(match[1])
          : 0;
      });

  const nextNumber =
    usedNumbers.length > 0
      ? Math.max(...usedNumbers) + 1
      : 1;

  return `${prefix}-${String(
    nextNumber
  ).padStart(3, "0")}`;
};

HAM.updateStats = function () {
  document.getElementById(
    "totalAssets"
  ).textContent =
    HAM.assets.length;

  document.getElementById(
    "assignedAssets"
  ).textContent =
    HAM.assets.filter(
      asset =>
        asset.status === "Assigned"
    ).length;

  document.getElementById(
    "availableAssets"
  ).textContent =
    HAM.assets.filter(
      asset =>
        asset.status === "Available"
    ).length;

  document.getElementById(
    "issueAssets"
  ).textContent =
    HAM.assets.filter(asset =>
      [
        "Repair",
        "Lost"
      ].includes(asset.status)
    ).length;
};

HAM.renderAssets = function () {
  const table =
    document.getElementById(
      "assetTable"
    );

  const search =
    document.getElementById(
      "search"
    );

  const query =
    String(search.value || "")
      .trim()
      .toLowerCase();

  const filteredAssets =
    HAM.assets.filter(asset => {
      return JSON.stringify(asset)
        .toLowerCase()
        .includes(query);
    });

  table.innerHTML = "";

  filteredAssets.forEach(asset => {
    const normalizedAsset =
      HAM.ensureOwnership(asset);

    const ownership =
      normalizedAsset.ownership;

    const ownershipType =
      ownership.acquisitionType ||
      HAM.OWNERSHIP_TYPES.UNKNOWN;

    const ownershipClass =
      HAM.getOwnershipBadgeClass(
        ownershipType
      );

    const ownershipDetail =
      ownershipType ===
        HAM.OWNERSHIP_TYPES.LEASED
        ? [
            ownership.lease.provider,
            ownership.lease.status
          ]
            .filter(Boolean)
            .join(" · ")
        : [
            ownership.vendor,
            HAM.formatMoney(
              ownership.cost,
              ownership.currency
            )
          ]
            .filter(Boolean)
            .join(" · ");

    const row =
      document.createElement("tr");

    row.innerHTML = `
      <td>
        <div class="asset-id">
          ${normalizedAsset.id}
        </div>

        <div class="small">
          ${
            normalizedAsset.createdAt
              ? new Date(
                  normalizedAsset.createdAt
                ).toLocaleDateString()
              : ""
          }
        </div>
      </td>

      <td>
        ${normalizedAsset.assetType}

        <div class="small">
          ${normalizedAsset.model || ""}
        </div>
      </td>

      <td>
        ${normalizedAsset.serialNumber}
      </td>

      <td>
        ${
          normalizedAsset.assignedTo ||
          "Unassigned"
        }

        <div class="small">
          ${
            normalizedAsset.employeeEmail ||
            ""
          }
        </div>
      </td>

      <td>
        <span
          class="badge ${normalizedAsset.status}"
        >
          ${normalizedAsset.status}
        </span>
      </td>

      <td>
        <span
          class="ownership-badge ${ownershipClass}"
        >
          ${ownershipType}
        </span>

        ${
          ownershipDetail
            ? `
              <div class="small">
                ${ownershipDetail}
              </div>
            `
            : ""
        }
      </td>

      <td>
        ${normalizedAsset.location || ""}
      </td>

      <td>
        <button
          class="action-btn"
          onclick="HAM.editAsset('${normalizedAsset.id}')"
        >
          Edit
        </button>

        <button
          class="action-btn"
          onclick="HAM.viewAssetHistory('${normalizedAsset.id}')"
        >
          History
        </button>

        ${
          normalizedAsset.status ===
          "Assigned"
            ? `
              <button
                class="action-btn"
                onclick="HAM.returnAsset('${normalizedAsset.id}')"
              >
                Return
              </button>
            `
            : ""
        }

        <button
          class="action-btn delete-btn"
          onclick="HAM.deleteAsset('${normalizedAsset.id}')"
        >
          Delete
        </button>
      </td>
    `;

    table.appendChild(row);
  });

  const emptyState =
    document.getElementById(
      "emptyState"
    );

  if (emptyState) {
    emptyState.style.display =
      filteredAssets.length > 0
        ? "none"
        : "block";
  }

  HAM.updateStats();
  HAM.renderReports();
  HAM.updateTransferOptions();
};

HAM.initInventory = function () {
  const form =
    document.getElementById(
      "assetForm"
    );

  const search =
    document.getElementById(
      "search"
    );

  const cancelEdit =
    document.getElementById(
      "cancelEdit"
    );

  form.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const editingId =
        HAM.getValue(
          "editingId"
        );

      const serialNumber =
        HAM.getValue(
          "serialNumber"
        ).trim();

      const selectedType =
        HAM.getValue(
          "assetType"
        );

      const status =
        HAM.getValue(
          "status"
        );

      const assignedTo =
        HAM.getValue(
          "assignedTo"
        ).trim();

      const employeeEmail =
        HAM.getValue(
          "employeeEmail"
        ).trim();

      const duplicate =
        HAM.assets.find(asset => {
          return (
            String(
              asset.serialNumber || ""
            ).toLowerCase() ===
              serialNumber.toLowerCase() &&
            asset.id !== editingId
          );
        });

      if (duplicate) {
        alert(
          "This serial number / unique ID already exists."
        );

        return;
      }

      if (
        status === "Assigned" &&
        (
          !assignedTo ||
          !employeeEmail
        )
      ) {
        alert(
          "Assigned assets require both Assigned To and Employee Email."
        );

        return;
      }

      const ownershipValidation =
        HAM.validateOwnershipForm();

      if (
        !ownershipValidation.valid
      ) {
        alert(
          ownershipValidation.message
        );

        return;
      }

      const ownership =
        ownershipValidation.ownership;

      const assetData = {
        assetType:
          selectedType,

        model:
          HAM.getValue("model"),

        serialNumber,

        assignedTo,

        employeeEmail,

        status,

        location:
          HAM.getValue("location"),

        notes:
          HAM.getValue("notes"),

        ownership,

        updatedAt:
          new Date().toISOString()
      };

      if (editingId) {
        const existingAsset =
          HAM.assets.find(
            asset =>
              asset.id === editingId
          );

        const previousOwnership =
          existingAsset
            ? HAM.getAssetOwnership(
                existingAsset
              )
            : HAM.createDefaultOwnership();

        HAM.assets =
          HAM.assets.map(asset => {
            if (
              asset.id !== editingId
            ) {
              return asset;
            }

            return HAM.ensureOwnership({
              ...asset,
              ...assetData
            });
          });

        HAM.addLifecycleEvent({
          assetId:
            editingId,

          type:
            "Updated",

          description:
            "Asset details were updated.",

          metadata: {
            assetType:
              assetData.assetType,

            model:
              assetData.model,

            status:
              assetData.status,

            assignedTo:
              assetData.assignedTo,

            employeeEmail:
              assetData.employeeEmail,

            location:
              assetData.location
          }
        });

        HAM.recordOwnershipChange({
          assetId:
            editingId,

          previousOwnership,

          newOwnership:
            ownership,

          isNewAsset:
            false
        });
      } else {
        const assetId =
          HAM.generateAssetId(
            selectedType
          );

        const createdAt =
          new Date().toISOString();

        HAM.assets.push(
          HAM.ensureOwnership({
            id: assetId,

            ...assetData,

            createdAt
          })
        );

        HAM.addLifecycleEvent({
          assetId,

          type:
            "Created",

          timestamp:
            createdAt,

          description:
            "Asset record was created.",

          metadata: {
            assetType:
              assetData.assetType,

            model:
              assetData.model,

            serialNumber:
              assetData.serialNumber,

            status:
              assetData.status
          }
        });

        HAM.recordOwnershipChange({
          assetId,

          previousOwnership:
            HAM.createDefaultOwnership(),

          newOwnership:
            ownership,

          isNewAsset:
            true
        });

        if (
          assetData.status ===
            "Assigned" &&
          assetData.assignedTo
        ) {
          HAM.addLifecycleEvent({
            assetId,

            type:
              "Assigned",

            timestamp:
              createdAt,

            description:
              `Asset assigned to ${assetData.assignedTo}.`,

            metadata: {
              employeeName:
                assetData.assignedTo,

              employeeEmail:
                assetData.employeeEmail,

              location:
                assetData.location
            }
          });
        }
      }

      HAM.saveAssets();
      HAM.resetForm();
      HAM.renderAssets();
    }
  );

  search.addEventListener(
    "input",
    HAM.renderAssets
  );

  cancelEdit.addEventListener(
    "click",
    HAM.resetForm
  );

  document
    .getElementById(
      "exportJson"
    )
    .addEventListener(
      "click",
      () => {
        HAM.downloadFile(
          "hiveway-assets.json",

          JSON.stringify(
            HAM.assets,
            null,
            2
          ),

          "application/json"
        );
      }
    );

  document
    .getElementById(
      "exportCsv"
    )
    .addEventListener(
      "click",
      HAM.exportAssetsCsv
    );

  document
    .getElementById(
      "importJson"
    )
    .addEventListener(
      "change",
      HAM.importAssetsJson
    );
};

HAM.editAsset = function (id) {
  const asset =
    HAM.assets.find(
      item =>
        item.id === id
    );

  if (!asset) {
    return;
  }

  const normalizedAsset =
    HAM.ensureOwnership(asset);

  HAM.setValue(
    "editingId",
    normalizedAsset.id
  );

  HAM.setValue(
    "assetType",
    normalizedAsset.assetType
  );

  HAM.updateModelOptions(
    normalizedAsset.model
  );

  HAM.setValue(
    "serialNumber",
    normalizedAsset.serialNumber
  );

  HAM.setValue(
    "assignedTo",
    normalizedAsset.assignedTo
  );

  HAM.setValue(
    "employeeEmail",
    normalizedAsset.employeeEmail
  );

  HAM.setValue(
    "status",
    normalizedAsset.status
  );

  HAM.setValue(
    "location",
    normalizedAsset.location
  );

  HAM.setValue(
    "notes",
    normalizedAsset.notes
  );

  HAM.populateOwnershipForm(
    normalizedAsset
  );

  document.getElementById(
    "formTitle"
  ).textContent =
    "Edit Asset";

  document.getElementById(
    "submitBtn"
  ).textContent =
    "Save Changes";

  document
    .getElementById(
      "cancelEdit"
    )
    .classList.remove(
      "hidden"
    );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

HAM.resetForm = function () {
  document
    .getElementById(
      "assetForm"
    )
    .reset();

  HAM.setValue(
    "editingId",
    ""
  );

  document.getElementById(
    "formTitle"
  ).textContent =
    "Add Asset";

  document.getElementById(
    "submitBtn"
  ).textContent =
    "Add Asset";

  document
    .getElementById(
      "cancelEdit"
    )
    .classList.add(
      "hidden"
    );

  HAM.updateModelOptions();
  HAM.resetOwnershipForm();
};

HAM.deleteAsset = function (id) {
  const asset =
    HAM.assets.find(
      item =>
        item.id === id
    );

  if (!asset) {
    return;
  }

  if (
    !confirm(
      "Delete this asset?"
    )
  ) {
    return;
  }

  HAM.addLifecycleEvent({
    assetId:
      id,

    type:
      "Deleted",

    description:
      "Asset record was deleted.",

    metadata: {
      assetType:
        asset.assetType || "",

      model:
        asset.model || "",

      serialNumber:
        asset.serialNumber || "",

      acquisitionType:
        asset.ownership?.acquisitionType ||
        HAM.OWNERSHIP_TYPES.UNKNOWN
    }
  });

  HAM.assets =
    HAM.assets.filter(
      item =>
        item.id !== id
    );

  HAM.saveAssets();
  HAM.renderAssets();
};

HAM.returnAsset = function (id) {
  const asset =
    HAM.assets.find(
      item =>
        item.id === id
    );

  if (!asset) {
    return;
  }

  const note =
    prompt(
      "Return notes:",
      "Returned to inventory."
    );

  HAM.assets =
    HAM.assets.map(item => {
      if (
        item.id !== id
      ) {
        return item;
      }

      return HAM.ensureOwnership({
        ...item,

        assignedTo:
          "",

        employeeEmail:
          "",

        status:
          "Available",

        updatedAt:
          new Date().toISOString()
      });
    });

  HAM.addLifecycleEvent({
    assetId:
      id,

    type:
      "Returned",

    description:
      note ||
      "Returned to inventory.",

    metadata: {
      fromName:
        asset.assignedTo ||
        "Unassigned",

      fromEmail:
        asset.employeeEmail ||
        "",

      toName:
        "Inventory",

      toEmail:
        "",

      location:
        asset.location ||
        ""
    }
  });

  HAM.saveAssets();
  HAM.renderAssets();

  alert(
    "Asset returned successfully."
  );
};

HAM.viewAssetHistory = function (id) {
  const asset =
    HAM.assets.find(
      item =>
        item.id === id
    );

  const events =
    HAM.getAssetLifecycle(id);

  if (
    !asset &&
    events.length === 0
  ) {
    return;
  }

  const normalizedAsset =
    asset
      ? HAM.ensureOwnership(asset)
      : null;

  const ownership =
    normalizedAsset?.ownership;

  const ownershipHtml =
    ownership
      ? `
        <section>
          <h2>Ownership</h2>

          <p>
            <strong>Acquisition Type:</strong>
            ${ownership.acquisitionType}
            <br>

            <strong>Vendor:</strong>
            ${ownership.vendor || "Not recorded"}
            <br>

            <strong>Acquisition Date:</strong>
            ${ownership.acquisitionDate || "Not recorded"}
            <br>

            <strong>Cost:</strong>
            ${
              HAM.formatMoney(
                ownership.cost,
                ownership.currency
              ) ||
              "Not recorded"
            }
            <br>

            <strong>Reference:</strong>
            ${ownership.reference || "Not recorded"}
          </p>

          ${
            ownership.acquisitionType ===
            HAM.OWNERSHIP_TYPES.LEASED
              ? `
                <h3>Lease Details</h3>

                <p>
                  <strong>Provider:</strong>
                  ${ownership.lease.provider || "Not recorded"}
                  <br>

                  <strong>Reference:</strong>
                  ${ownership.lease.reference || "Not recorded"}
                  <br>

                  <strong>Start:</strong>
                  ${ownership.lease.startDate || "Not recorded"}
                  <br>

                  <strong>End:</strong>
                  ${ownership.lease.endDate || "Not recorded"}
                  <br>

                  <strong>Status:</strong>
                  ${ownership.lease.status || "Not recorded"}
                  <br>

                  <strong>Monthly Cost:</strong>
                  ${
                    HAM.formatMoney(
                      ownership.lease.monthlyCost,
                      ownership.currency
                    ) ||
                    "Not recorded"
                  }
                </p>
              `
              : ""
          }
        </section>
      `
      : "";

  const eventHtml =
    events.length > 0
      ? events
          .map(event => {
            return `
              <div class="transfer-history">
                <strong>
                  ${event.type}
                </strong>
                <br>

                Date:
                ${
                  event.timestamp
                    ? new Date(
                        event.timestamp
                      ).toLocaleString()
                    : ""
                }
                <br>

                ${
                  event.description
                    ? `
                      Description:
                      ${event.description}
                      <br>
                    `
                    : ""
                }

                ${
                  event.performedBy
                    ? `
                      Performed By:
                      ${event.performedBy}
                      <br>
                    `
                    : ""
                }
              </div>
            `;
          })
          .join("")
      : "<p>No lifecycle events yet.</p>";

  HAM.openPopup(
    `${id} Lifecycle`,

    `
      <h1>${id}</h1>

      ${
        normalizedAsset
          ? `
            <section>
              <h2>
                ${normalizedAsset.assetType}
              </h2>

              <p>
                <strong>Model:</strong>
                ${normalizedAsset.model || ""}
                <br>

                <strong>Serial:</strong>
                ${normalizedAsset.serialNumber || ""}
                <br>

                <strong>Status:</strong>
                ${normalizedAsset.status || ""}
                <br>

                <strong>Assigned To:</strong>
                ${
                  normalizedAsset.assignedTo ||
                  "Unassigned"
                }
                <br>

                <strong>Location:</strong>
                ${normalizedAsset.location || ""}
              </p>
            </section>

            ${ownershipHtml}
          `
          : `
            <section>
              <p>
                This asset record was deleted.
                Its lifecycle events remain available.
              </p>
            </section>
          `
      }

      <h2>
        Lifecycle Events
      </h2>

      ${eventHtml}
    `
  );
};

HAM.exportAssetsCsv = function () {
  const headers = [
    "id",
    "assetType",
    "model",
    "serialNumber",
    "assignedTo",
    "employeeEmail",
    "status",
    "location",
    "notes",
    "createdAt",
    "updatedAt",
    "acquisitionType",
    "ownershipVendor",
    "acquisitionDate",
    "ownershipCost",
    "ownershipCurrency",
    "ownershipReference",
    "ownershipNotes",
    "leaseProvider",
    "leaseReference",
    "leaseStartDate",
    "leaseEndDate",
    "leaseReturnDate",
    "leaseMonthlyCost",
    "leaseResidualValue",
    "leaseStatus"
  ];

  const rows =
    HAM.assets.map(asset => {
      const normalizedAsset =
        HAM.ensureOwnership(asset);

      const ownership =
        normalizedAsset.ownership;

      const values = {
        ...normalizedAsset,

        acquisitionType:
          ownership.acquisitionType,

        ownershipVendor:
          ownership.vendor,

        acquisitionDate:
          ownership.acquisitionDate,

        ownershipCost:
          ownership.cost,

        ownershipCurrency:
          ownership.currency,

        ownershipReference:
          ownership.reference,

        ownershipNotes:
          ownership.notes,

        leaseProvider:
          ownership.lease.provider,

        leaseReference:
          ownership.lease.reference,

        leaseStartDate:
          ownership.lease.startDate,

        leaseEndDate:
          ownership.lease.endDate,

        leaseReturnDate:
          ownership.lease.returnDate,

        leaseMonthlyCost:
          ownership.lease.monthlyCost,

        leaseResidualValue:
          ownership.lease.residualValue,

        leaseStatus:
          ownership.lease.status
      };

      return headers
        .map(header => {
          const value =
            values[header] ??
            "";

          return `"${String(value)
            .replaceAll(
              '"',
              '""'
            )}"`;
        })
        .join(",");
    });

  HAM.downloadFile(
    "hiveway-assets.csv",

    [
      headers.join(","),
      ...rows
    ].join("\n"),

    "text/csv"
  );
};

HAM.importAssetsJson = function (event) {
  const file =
    event.target.files[0];

  if (!file) {
    return;
  }

  const reader =
    new FileReader();

  reader.onload = () => {
    try {
      const imported =
        JSON.parse(
          reader.result
        );

      if (
        !Array.isArray(
          imported
        )
      ) {
        alert(
          "Invalid JSON file. Expected an array of assets."
        );

        return;
      }

      HAM.assets =
        imported.map(asset =>
          HAM.ensureOwnership({
            ...asset
          })
        );

      HAM.saveAssets();

      localStorage.removeItem(
        HAM.lifecycleMigrationKey
      );

      HAM.migrateLegacyHistory();
      HAM.migrateOwnership();
      HAM.renderAssets();

      alert(
        "Assets imported successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        "Could not read JSON file."
      );
    }
  };

  reader.readAsText(file);

  event.target.value = "";
};
