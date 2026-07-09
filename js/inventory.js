window.HAM = window.HAM || {};

HAM.assetPrefix = function (type) {
  return HAM.assetPrefixes[type] || "HW-AST";
};

HAM.generateAssetId = function (type) {
  const prefix = HAM.assetPrefix(type);
  const count = HAM.assets.filter(asset => asset.id && asset.id.startsWith(prefix)).length + 1;
  return `${prefix}-${String(count).padStart(3, "0")}`;
};

HAM.updateStats = function () {
  document.getElementById("totalAssets").textContent = HAM.assets.length;

  document.getElementById("assignedAssets").textContent =
    HAM.assets.filter(asset => asset.status === "Assigned").length;

  document.getElementById("availableAssets").textContent =
    HAM.assets.filter(asset => asset.status === "Available").length;

  document.getElementById("issueAssets").textContent =
    HAM.assets.filter(asset => ["Repair", "Lost"].includes(asset.status)).length;
};

HAM.renderAssets = function () {
  const table = document.getElementById("assetTable");
  const search = document.getElementById("search");
  const query = search.value.toLowerCase();

  const filteredAssets = HAM.assets.filter(asset =>
    JSON.stringify(asset).toLowerCase().includes(query)
  );

  table.innerHTML = "";

  filteredAssets.forEach(asset => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div class="asset-id">${asset.id}</div>
        <div class="small">${asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : ""}</div>
      </td>

      <td>
        ${asset.assetType}
        <div class="small">${asset.model || ""}</div>
      </td>

      <td>${asset.serialNumber}</td>

      <td>
        ${asset.assignedTo || "Unassigned"}
        <div class="small">${asset.employeeEmail || ""}</div>
      </td>

      <td>
        <span class="badge ${asset.status}">${asset.status}</span>
      </td>

      <td>${asset.location || ""}</td>

      <td>
        <button class="action-btn" onclick="HAM.editAsset('${asset.id}')">Edit</button>
        <button class="action-btn" onclick="HAM.viewAssetHistory('${asset.id}')">History</button>
        ${
          asset.status === "Assigned"
            ? `<button class="action-btn" onclick="HAM.returnAsset('${asset.id}')">Return</button>`
            : ""
        }
        <button class="action-btn delete-btn" onclick="HAM.deleteAsset('${asset.id}')">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });

  const emptyState = document.getElementById("emptyState");
  if (emptyState) {
    emptyState.style.display = filteredAssets.length ? "none" : "block";
  }

  HAM.updateStats();
  HAM.renderReports();
  HAM.updateTransferOptions();
};

HAM.initInventory = function () {
  const form = document.getElementById("assetForm");
  const search = document.getElementById("search");
  const cancelEdit = document.getElementById("cancelEdit");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const editingId = HAM.getValue("editingId");
    const serialNumber = HAM.getValue("serialNumber").trim();
    const selectedType = HAM.getValue("assetType");
    const status = HAM.getValue("status");
    const assignedTo = HAM.getValue("assignedTo").trim();
    const employeeEmail = HAM.getValue("employeeEmail").trim();

    const duplicate = HAM.assets.find(asset =>
      asset.serialNumber.toLowerCase() === serialNumber.toLowerCase() &&
      asset.id !== editingId
    );

    if (duplicate) {
      alert("This serial number / unique ID already exists.");
      return;
    }

    if (status === "Assigned" && (!assignedTo || !employeeEmail)) {
      alert("Assigned assets require both Assigned To and Employee Email.");
      return;
    }

    const assetData = {
      assetType: selectedType,
      model: HAM.getValue("model"),
      serialNumber,
      assignedTo,
      employeeEmail,
      status,
      location: HAM.getValue("location"),
      notes: HAM.getValue("notes"),
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      HAM.assets = HAM.assets.map(asset =>
        asset.id === editingId
          ? { ...asset, ...assetData, history: asset.history || [] }
          : asset
      );
    } else {
      HAM.assets.push({
        id: HAM.generateAssetId(selectedType),
        ...assetData,
        createdAt: new Date().toISOString(),
        history: [
          {
            type: "Created",
            date: new Date().toISOString(),
            note: "Asset created."
          }
        ]
      });
    }

    HAM.saveAssets();
    HAM.resetForm();
    HAM.renderAssets();
  });

  search.addEventListener("input", HAM.renderAssets);
  cancelEdit.addEventListener("click", HAM.resetForm);

  document.getElementById("exportJson").addEventListener("click", () => {
    HAM.downloadFile("hiveway-assets.json", JSON.stringify(HAM.assets, null, 2));
  });

  document.getElementById("exportCsv").addEventListener("click", HAM.exportAssetsCsv);

  document.getElementById("importJson").addEventListener("change", HAM.importAssetsJson);
};

HAM.editAsset = function (id) {
  const asset = HAM.assets.find(item => item.id === id);
  if (!asset) return;

  HAM.setValue("editingId", asset.id);
  HAM.setValue("assetType", asset.assetType);
  HAM.updateModelOptions(asset.model);

  HAM.setValue("serialNumber", asset.serialNumber);
  HAM.setValue("assignedTo", asset.assignedTo);
  HAM.setValue("employeeEmail", asset.employeeEmail);
  HAM.setValue("status", asset.status);
  HAM.setValue("location", asset.location);
  HAM.setValue("notes", asset.notes);

  document.getElementById("formTitle").textContent = "Edit Asset";
  document.getElementById("submitBtn").textContent = "Save Changes";
  document.getElementById("cancelEdit").classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
};

HAM.resetForm = function () {
  document.getElementById("assetForm").reset();
  HAM.setValue("editingId", "");
  document.getElementById("formTitle").textContent = "Add Asset";
  document.getElementById("submitBtn").textContent = "Add Asset";
  document.getElementById("cancelEdit").classList.add("hidden");
  HAM.updateModelOptions();
};

HAM.deleteAsset = function (id) {
  if (!confirm("Delete this asset?")) return;

  HAM.assets = HAM.assets.filter(asset => asset.id !== id);
  HAM.saveAssets();
  HAM.renderAssets();
};

HAM.returnAsset = function (id) {
  const asset = HAM.assets.find(item => item.id === id);
  if (!asset) return;

  const note = prompt("Return notes:", "Returned to inventory.");

  HAM.assets = HAM.assets.map(item => {
    if (item.id !== id) return item;

    const historyItem = {
      type: "Returned",
      date: new Date().toISOString(),
      fromName: item.assignedTo || "Unassigned",
      fromEmail: item.employeeEmail || "",
      toName: "Inventory",
      toEmail: "",
      note: note || "Returned to inventory."
    };

    return {
      ...item,
      assignedTo: "",
      employeeEmail: "",
      status: "Available",
      updatedAt: new Date().toISOString(),
      history: [...(item.history || []), historyItem]
    };
  });

  HAM.saveAssets();
  HAM.renderAssets();
  alert("Asset returned successfully.");
};

HAM.viewAssetHistory = function (id) {
  const asset = HAM.assets.find(item => item.id === id);
  if (!asset) return;

  const history = asset.history || [];

  const historyHtml = history.length
    ? history.map(item => `
        <div class="transfer-history">
          <strong>${item.type || "Transfer"}</strong><br>
          Date: ${item.date ? new Date(item.date).toLocaleString() : ""}<br>
          ${item.fromName ? `From: ${item.fromName} ${item.fromEmail ? `(${item.fromEmail})` : ""}<br>` : ""}
          ${item.toName ? `To: ${item.toName} ${item.toEmail ? `(${item.toEmail})` : ""}<br>` : ""}
          ${item.note ? `Note: ${item.note}` : ""}
        </div>
      `).join("")
    : "<p>No history yet.</p>";

  HAM.openPopup(
    `${asset.id} History`,
    `
      <h1>${asset.id}</h1>

      <section>
        <h2>${asset.assetType}</h2>
        <p>
          <strong>Model:</strong> ${asset.model || ""}<br>
          <strong>Serial:</strong> ${asset.serialNumber}<br>
          <strong>Status:</strong> ${asset.status}<br>
          <strong>Assigned To:</strong> ${asset.assignedTo || "Unassigned"}<br>
          <strong>Location:</strong> ${asset.location || ""}
        </p>
      </section>

      <h2>History</h2>
      ${historyHtml}
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
    "history"
  ];

  const rows = HAM.assets.map(asset =>
    headers.map(header => {
      const value =
        header === "history"
          ? JSON.stringify(asset.history || [])
          : asset[header] || "";

      return `"${String(value).replaceAll('"', '""')}"`;
    }).join(",")
  );

  HAM.downloadFile("hiveway-assets.csv", [headers.join(","), ...rows].join("\n"));
};

HAM.importAssetsJson = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);

      if (!Array.isArray(imported)) {
        alert("Invalid JSON file. Expected an array of assets.");
        return;
      }

      HAM.assets = imported.map(asset => ({
        ...asset,
        history: asset.history || []
      }));

      HAM.saveAssets();
      HAM.renderAssets();
      alert("Assets imported successfully.");
    } catch {
      alert("Could not read JSON file.");
    }
  };

  reader.readAsText(file);
};
