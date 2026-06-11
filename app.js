const form = document.getElementById("assetForm");
const table = document.getElementById("assetTable");
const search = document.getElementById("search");
const assetTypeSelect = document.getElementById("assetType");
const modelSelect = document.getElementById("model");
const customAssetTypeWrapper = document.getElementById("customAssetTypeWrapper");
const customAssetTypeInput = document.getElementById("customAssetType");
const customModelWrapper = document.getElementById("customModelWrapper");
const customModelInput = document.getElementById("customModel");
const acquisitionTypeSelect = document.getElementById("acquisitionType");
const leaseFieldsWrapper = document.getElementById("leaseFieldsWrapper");

let assets = JSON.parse(localStorage.getItem("hivewayAssets")) || [];

const assetCatalog = {
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

  "BBPOS WisePad 3": ["BBPOS WisePad 3"],
  "BBPOS WisePOS E": ["BBPOS WisePOS E"],
  "BBPOS WisePOS E Dock": ["BBPOS WisePOS E Dock"],
  "Stripe Reader M2": ["Stripe Reader M2"],
  "Stripe Reader S700": ["Stripe Reader S700"],
  "Stripe Terminal Test Card": ["Stripe Terminal Test Card"],
  "Interac Test Card": ["Interac Test Card"],
  "Other / Custom": ["Custom Model"]
};

function updateCustomFields() {
  const isCustomType = assetTypeSelect.value === "Other / Custom";

  if (isCustomType) {
    customAssetTypeWrapper.classList.remove("hidden");
    customAssetTypeInput.required = true;
    customModelWrapper.classList.remove("hidden");
    customModelInput.required = true;
    modelSelect.required = false;
  } else {
    customAssetTypeWrapper.classList.add("hidden");
    customAssetTypeInput.required = false;
    customAssetTypeInput.value = "";
    customModelWrapper.classList.add("hidden");
    customModelInput.required = false;
    customModelInput.value = "";
    modelSelect.required = true;
  }
}

function updateLeaseFields() {
  const isLeased = acquisitionTypeSelect.value === "Leased";

  if (isLeased) {
    leaseFieldsWrapper.classList.remove("hidden");
    document.getElementById("leaseStatus").required = true;
  } else {
    leaseFieldsWrapper.classList.add("hidden");
    document.getElementById("leaseStatus").required = false;
    document.getElementById("leaseStatus").value = "";
    document.getElementById("leaseProvider").value = "";
    document.getElementById("leaseStartDate").value = "";
    document.getElementById("leaseEndDate").value = "";
    document.getElementById("leaseReturnDate").value = "";
    document.getElementById("leaseReference").value = "";
  }
}

function updateModelOptions(selectedModel = "") {
  const type = assetTypeSelect.value;
  const models = assetCatalog[type] || [];

  modelSelect.innerHTML = "";

  if (!type) {
    modelSelect.innerHTML = `<option value="">Select asset type first</option>`;
    return;
  }

  modelSelect.innerHTML = `<option value="">Select model</option>`;

  models.forEach(model => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });

  if (selectedModel) {
    modelSelect.value = selectedModel;
  }
}

assetTypeSelect.addEventListener("change", () => {
  updateModelOptions();
  updateCustomFields();
});

acquisitionTypeSelect.addEventListener("change", updateLeaseFields);

function assetPrefix(type) {
  const map = {
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
    "Other / Custom": "HW-CUS"
  };

  return map[type] || "HW-CUS";
}

function generateAssetId(type) {
  const prefix = assetPrefix(type);
  const count = assets.filter(asset => asset.id && asset.id.startsWith(prefix)).length + 1;

  return `${prefix}-${String(count).padStart(3, "0")}`;
}

function saveAssets() {
  localStorage.setItem("hivewayAssets", JSON.stringify(assets));
}

function updateStats() {
  document.getElementById("totalAssets").textContent = assets.length;

  document.getElementById("assignedAssets").textContent =
    assets.filter(asset => asset.status === "Assigned").length;

  document.getElementById("availableAssets").textContent =
    assets.filter(asset => asset.status === "Available").length;

  document.getElementById("issueAssets").textContent =
    assets.filter(asset => ["Repair", "Lost"].includes(asset.status)).length;
}

function renderAssets() {
  const query = search.value.toLowerCase();

  const filteredAssets = assets.filter(asset =>
    JSON.stringify(asset).toLowerCase().includes(query)
  );

  table.innerHTML = "";

  filteredAssets.forEach(asset => {
    const row = document.createElement("tr");
    const acquisitionType = asset.acquisitionType || "Owned";
    const leaseStatus = asset.leaseStatus || "";

    row.innerHTML = `
      <td>
        <div class="asset-id">${asset.id}</div>
        <div class="small">${asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : ""}</div>
      </td>

      <td>
        ${asset.assetType}
        <div class="small">${asset.model || ""}</div>
        <div class="small">Condition: ${asset.condition || "Unknown"}</div>
        <div class="small">Acquisition: ${acquisitionType}${leaseStatus ? ` — ${leaseStatus}` : ""}</div>
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
        <button onclick="editAsset('${asset.id}')">Edit</button>
        <button onclick="viewAssetHistory('${asset.id}')">History</button>
        ${
          asset.status === "Assigned"
            ? `<button onclick="returnAsset('${asset.id}')">Return</button>`
            : ""
        }
        ${
          asset.acquisitionType === "Leased" && asset.leaseStatus !== "Returned After Lease"
            ? `<button onclick="returnLeaseAsset('${asset.id}')">Lease Return</button>`
            : ""
        }
        <button class="delete-btn" onclick="deleteAsset('${asset.id}')">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });

  document.getElementById("emptyState").style.display =
    filteredAssets.length ? "none" : "block";

  updateStats();
  renderReports();
  updateTransferOptions();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const editingId = document.getElementById("editingId").value;
  const serialNumber = document.getElementById("serialNumber").value.trim();
  const selectedType = assetTypeSelect.value;
  const status = document.getElementById("status").value;
  const assignedTo = document.getElementById("assignedTo").value.trim();
  const employeeEmail = document.getElementById("employeeEmail").value.trim();
  const acquisitionType = document.getElementById("acquisitionType").value;
  const leaseStatus = document.getElementById("leaseStatus").value;

  const duplicate = assets.find(asset =>
    asset.serialNumber.toLowerCase() === serialNumber.toLowerCase() &&
    asset.id !== editingId
  );

  if (duplicate) {
    alert("This serial number / unique ID already exists.");
    return;
  }

  if (selectedType === "Other / Custom" && !customAssetTypeInput.value.trim()) {
    alert("Please enter a custom asset type.");
    return;
  }

  if (selectedType === "Other / Custom" && !customModelInput.value.trim()) {
    alert("Please enter a custom model.");
    return;
  }

  if (status === "Assigned" && (!assignedTo || !employeeEmail)) {
    alert("Assigned assets require both Assigned To and Employee Email.");
    return;
  }

  if (acquisitionType === "Leased" && !leaseStatus) {
    alert("Leased assets require a lease status.");
    return;
  }

  if (
    acquisitionType === "Leased" &&
    leaseStatus === "Returned After Lease" &&
    !document.getElementById("leaseReturnDate").value
  ) {
    alert("Returned leased assets require a lease return date.");
    return;
  }

  const type =
    selectedType === "Other / Custom"
      ? customAssetTypeInput.value.trim()
      : selectedType;

  const model =
    selectedType === "Other / Custom"
      ? customModelInput.value.trim()
      : modelSelect.value;

  const assetData = {
    assetType: type,
    model,
    serialNumber,
    assignedTo,
    employeeEmail,
    status,
    condition: document.getElementById("condition").value,
    acquisitionType,
    leaseStatus: acquisitionType === "Leased" ? leaseStatus : "",
    leaseProvider: acquisitionType === "Leased" ? document.getElementById("leaseProvider").value : "",
    leaseStartDate: acquisitionType === "Leased" ? document.getElementById("leaseStartDate").value : "",
    leaseEndDate: acquisitionType === "Leased" ? document.getElementById("leaseEndDate").value : "",
    leaseReturnDate: acquisitionType === "Leased" ? document.getElementById("leaseReturnDate").value : "",
    leaseReference: acquisitionType === "Leased" ? document.getElementById("leaseReference").value : "",
    location: document.getElementById("location").value,
    purchaseDate: document.getElementById("purchaseDate").value,
    warrantyExpiry: document.getElementById("warrantyExpiry").value,
    vendor: document.getElementById("vendor").value,
    cost: document.getElementById("cost").value,
    notes: document.getElementById("notes").value,
    updatedAt: new Date().toISOString()
  };

  if (editingId) {
    assets = assets.map(asset => {
      if (asset.id !== editingId) return asset;

      return {
        ...asset,
        ...assetData,
        history: asset.history || []
      };
    });
  } else {
    assets.push({
      id: generateAssetId(selectedType),
      ...assetData,
      createdAt: new Date().toISOString(),
      history: [
        {
          type: "Created",
          date: new Date().toISOString(),
          note: `Asset created as ${acquisitionType}.`
        }
      ]
    });
  }

  saveAssets();
  resetForm();
  renderAssets();
});

function editAsset(id) {
  const asset = assets.find(item => item.id === id);
  if (!asset) return;

  document.getElementById("editingId").value = asset.id;

  if (assetCatalog[asset.assetType]) {
    assetTypeSelect.value = asset.assetType;
    updateModelOptions(asset.model);
    customAssetTypeWrapper.classList.add("hidden");
    customAssetTypeInput.required = false;
    customAssetTypeInput.value = "";
    customModelWrapper.classList.add("hidden");
    customModelInput.required = false;
    customModelInput.value = "";
    modelSelect.required = true;
  } else {
    assetTypeSelect.value = "Other / Custom";
    updateModelOptions();
    customAssetTypeWrapper.classList.remove("hidden");
    customAssetTypeInput.required = true;
    customAssetTypeInput.value = asset.assetType;
    customModelWrapper.classList.remove("hidden");
    customModelInput.required = true;
    customModelInput.value = asset.model || "";
    modelSelect.required = false;
  }

  document.getElementById("serialNumber").value = asset.serialNumber;
  document.getElementById("assignedTo").value = asset.assignedTo || "";
  document.getElementById("employeeEmail").value = asset.employeeEmail || "";
  document.getElementById("status").value = asset.status;
  document.getElementById("condition").value = asset.condition || "Unknown";
  document.getElementById("acquisitionType").value = asset.acquisitionType || "Owned";
  updateLeaseFields();

  document.getElementById("leaseStatus").value = asset.leaseStatus || "";
  document.getElementById("leaseProvider").value = asset.leaseProvider || "";
  document.getElementById("leaseStartDate").value = asset.leaseStartDate || "";
  document.getElementById("leaseEndDate").value = asset.leaseEndDate || "";
  document.getElementById("leaseReturnDate").value = asset.leaseReturnDate || "";
  document.getElementById("leaseReference").value = asset.leaseReference || "";

  document.getElementById("location").value = asset.location || "";
  document.getElementById("purchaseDate").value = asset.purchaseDate || "";
  document.getElementById("warrantyExpiry").value = asset.warrantyExpiry || "";
  document.getElementById("vendor").value = asset.vendor || "";
  document.getElementById("cost").value = asset.cost || "";
  document.getElementById("notes").value = asset.notes || "";

  document.getElementById("formTitle").textContent = "Edit Asset";
  document.getElementById("submitBtn").textContent = "Save Changes";
  document.getElementById("cancelEdit").classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  form.reset();
  document.getElementById("editingId").value = "";
  document.getElementById("formTitle").textContent = "Add Asset";
  document.getElementById("submitBtn").textContent = "Add Asset";
  document.getElementById("cancelEdit").classList.add("hidden");
  updateModelOptions();
  updateCustomFields();
  updateLeaseFields();
}

document.getElementById("cancelEdit").addEventListener("click", resetForm);

function deleteAsset(id) {
  if (!confirm("Delete this asset?")) return;

  assets = assets.filter(asset => asset.id !== id);
  saveAssets();
  renderAssets();
}

function returnAsset(id) {
  const asset = assets.find(item => item.id === id);
  if (!asset) return;

  const note = prompt("Return notes:", "Returned to inventory.");

  assets = assets.map(item => {
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

  saveAssets();
  renderAssets();
  alert("Asset returned successfully.");
}

function returnLeaseAsset(id) {
  const asset = assets.find(item => item.id === id);
  if (!asset) return;

  if (!confirm("Mark this leased asset as returned after lease?")) return;

  const note = prompt("Lease return notes:", "Returned to leasing provider.");

  assets = assets.map(item => {
    if (item.id !== id) return item;

    const historyItem = {
      type: "Lease Returned",
      date: new Date().toISOString(),
      fromName: item.assignedTo || "Inventory",
      fromEmail: item.employeeEmail || "",
      toName: item.leaseProvider || "Leasing Provider",
      toEmail: "",
      note: note || "Returned to leasing provider."
    };

    return {
      ...item,
      assignedTo: "",
      employeeEmail: "",
      status: "Retired",
      leaseStatus: "Returned After Lease",
      leaseReturnDate: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
      history: [...(item.history || []), historyItem]
    };
  });

  saveAssets();
  renderAssets();
  alert("Leased asset marked as returned.");
}

function viewAssetHistory(id) {
  const asset = assets.find(item => item.id === id);
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

  const popup = window.open("", "_blank", "width=760,height=850");

  popup.document.write(`
    <html>
      <head>
        <title>${asset.id} History</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #111827;
            background: #f8fafc;
          }

          h1, h2, h3 {
            color: #4b4f5c;
          }

          section {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 18px;
            margin-bottom: 18px;
          }

          .transfer-history {
            margin-top: 12px;
            padding: 12px;
            border-radius: 12px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
          }
        </style>
      </head>

      <body>
        <h1>${asset.id}</h1>
        <section>
          <h2>${asset.assetType}</h2>
          <p>
            <strong>Model:</strong> ${asset.model || ""}<br>
            <strong>Serial:</strong> ${asset.serialNumber}<br>
            <strong>Status:</strong> ${asset.status}<br>
            <strong>Condition:</strong> ${asset.condition || "Unknown"}<br>
            <strong>Acquisition Type:</strong> ${asset.acquisitionType || "Owned"}<br>
            <strong>Lease Status:</strong> ${asset.leaseStatus || ""}<br>
            <strong>Leasing Company:</strong> ${asset.leaseProvider || ""}<br>
            <strong>Lease Start:</strong> ${asset.leaseStartDate || ""}<br>
            <strong>Lease End:</strong> ${asset.leaseEndDate || ""}<br>
            <strong>Lease Return:</strong> ${asset.leaseReturnDate || ""}<br>
            <strong>Lease Reference:</strong> ${asset.leaseReference || ""}<br>
            <strong>Assigned To:</strong> ${asset.assignedTo || "Unassigned"}<br>
            <strong>Location:</strong> ${asset.location || ""}<br>
            <strong>Vendor:</strong> ${asset.vendor || ""}<br>
            <strong>Cost:</strong> ${asset.cost || ""}<br>
            <strong>Warranty Expiry:</strong> ${asset.warrantyExpiry || ""}
          </p>
        </section>

        <h2>History</h2>
        ${historyHtml}
      </body>
    </html>
  `);
}

search.addEventListener("input", renderAssets);

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".tab-view").forEach(view => view.classList.remove("active-view"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active-view");
  });
});

document.getElementById("exportJson").addEventListener("click", () => {
  downloadFile("hiveway-assets.json", JSON.stringify(assets, null, 2));
});

document.getElementById("exportCsv").addEventListener("click", () => {
  const headers = [
    "id",
    "assetType",
    "model",
    "serialNumber",
    "assignedTo",
    "employeeEmail",
    "status",
    "condition",
    "acquisitionType",
    "leaseStatus",
    "leaseProvider",
    "leaseStartDate",
    "leaseEndDate",
    "leaseReturnDate",
    "leaseReference",
    "location",
    "purchaseDate",
    "warrantyExpiry",
    "vendor",
    "cost",
    "notes",
    "createdAt",
    "updatedAt",
    "history"
  ];

  const rows = assets.map(asset =>
    headers.map(header => {
      const value =
        header === "history"
          ? JSON.stringify(asset.history || [])
          : asset[header] || "";

      return `"${String(value).replaceAll('"', '""')}"`;
    }).join(",")
  );

  downloadFile("hiveway-assets.csv", [headers.join(","), ...rows].join("\n"));
});

document.getElementById("importJson").addEventListener("change", event => {
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

      assets = imported.map(asset => ({
        ...asset,
        history: asset.history || [],
        condition: asset.condition || "Unknown",
        acquisitionType: asset.acquisitionType || "Owned",
        leaseStatus: asset.leaseStatus || "",
        leaseProvider: asset.leaseProvider || "",
        leaseStartDate: asset.leaseStartDate || "",
        leaseEndDate: asset.leaseEndDate || "",
        leaseReturnDate: asset.leaseReturnDate || "",
        leaseReference: asset.leaseReference || ""
      }));

      saveAssets();
      renderAssets();
      alert("Assets imported successfully.");
    } catch {
      alert("Could not read JSON file.");
    }
  };

  reader.readAsText(file);
});

function renderReports() {
  renderGroupedReport("employeeReport", groupByEmployee());
  renderGroupedReport("statusReport", groupByField("status"));
  renderGroupedReport("typeReport", groupByField("assetType"));
  renderGroupedReport("acquisitionReport", groupByField("acquisitionType"));
  renderLeaseReport();
}

function groupByEmployee() {
  const groups = {};

  assets.forEach(asset => {
    const name = asset.assignedTo || "Unassigned";
    const email = asset.employeeEmail || "";
    const key = `${name}|${email}`;

    if (!groups[key]) {
      groups[key] = { label: name, email, count: 0 };
    }

    groups[key].count += 1;
  });

  return Object.values(groups);
}

function groupByField(field) {
  const groups = {};

  assets.forEach(asset => {
    const label = asset[field] || (field === "acquisitionType" ? "Owned" : "Unknown");

    if (!groups[label]) {
      groups[label] = { label, count: 0 };
    }

    groups[label].count += 1;
  });

  return Object.values(groups);
}

function renderGroupedReport(elementId, rows) {
  const body = document.getElementById(elementId);
  body.innerHTML = "";

  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="3">No data yet.</td></tr>`;
    return;
  }

  rows
    .sort((a, b) => b.count - a.count)
    .forEach(row => {
      const tr = document.createElement("tr");

      if (elementId === "employeeReport") {
        tr.innerHTML = `
          <td>
            <span class="report-link" onclick="showEmployeeAssets('${escapeForAttribute(row.label)}', '${escapeForAttribute(row.email || "")}')">
              ${row.label}
            </span>
          </td>
          <td>${row.email || ""}</td>
          <td>${row.count}</td>
        `;
      } else {
        tr.innerHTML = `
          <td>${row.label}</td>
          <td>${row.count}</td>
        `;
      }

      body.appendChild(tr);
    });
}

function renderLeaseReport() {
  const body = document.getElementById("leaseReport");
  body.innerHTML = "";

  const leasedAssets = assets
    .filter(asset =>
      asset.acquisitionType === "Leased" &&
      asset.leaseStatus !== "Returned After Lease"
    )
    .sort((a, b) => {
      const dateA = a.leaseEndDate || "9999-12-31";
      const dateB = b.leaseEndDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });

  if (!leasedAssets.length) {
    body.innerHTML = `<tr><td colspan="3">No active leased assets.</td></tr>`;
    return;
  }

  leasedAssets.forEach(asset => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <span class="report-link" onclick="viewAssetHistory('${asset.id}')">${asset.id}</span>
        <div class="small">${asset.assetType} — ${asset.model || ""}</div>
      </td>
      <td>${asset.leaseEndDate || "Not set"}</td>
      <td>${asset.leaseStatus || "Active Lease"}</td>
    `;

    body.appendChild(tr);
  });
}

function showEmployeeAssets(name, email) {
  const employeeAssets = assets.filter(asset =>
    (asset.assignedTo || "Unassigned") === name &&
    (asset.employeeEmail || "") === email
  );

  const list = employeeAssets
    .map(asset => {
      const history = asset.history || [];

      const historyHtml = history.length
        ? history.map(item => `
            <div class="transfer-history">
              <strong>${item.type || "Transfer"}</strong><br>
              ${item.date ? new Date(item.date).toLocaleDateString() : ""}<br>
              From: ${item.fromName || "Unassigned"} ${item.fromEmail ? `(${item.fromEmail})` : ""}<br>
              To: ${item.toName || "Unassigned"} ${item.toEmail ? `(${item.toEmail})` : ""}<br>
              ${item.note ? `Note: ${item.note}` : ""}
            </div>
          `).join("")
        : `<p>No transfer history yet.</p>`;

      return `
        <section>
          <h3>${asset.id}</h3>
          <p>
            <strong>${asset.assetType}</strong><br>
            ${asset.model || ""}<br>
            Serial: ${asset.serialNumber}<br>
            Status: ${asset.status}<br>
            Condition: ${asset.condition || "Unknown"}<br>
            Acquisition: ${asset.acquisitionType || "Owned"}<br>
            Lease Status: ${asset.leaseStatus || ""}<br>
            Lease End: ${asset.leaseEndDate || ""}<br>
            Location: ${asset.location || ""}
          </p>
          <h4>History</h4>
          ${historyHtml}
        </section>
        <hr>
      `;
    })
    .join("");

  const popup = window.open("", "_blank", "width=760,height=850");

  popup.document.write(`
    <html>
      <head>
        <title>${name} Assets</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #111827;
            background: #f8fafc;
          }

          h1, h2, h3 {
            color: #4b4f5c;
          }

          section {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 18px;
            margin-bottom: 18px;
          }

          hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 20px 0;
          }

          .transfer-history {
            margin-top: 12px;
            padding: 12px;
            border-radius: 12px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
          }
        </style>
      </head>

      <body>
        <h1>${name}</h1>
        <p>${email || ""}</p>
        <h2>Assigned Assets</h2>
        ${list || "<p>No assets assigned.</p>"}
      </body>
    </html>
  `);
}

function updateTransferOptions() {
  const transferAsset = document.getElementById("transferAsset");
  if (!transferAsset) return;

  transferAsset.innerHTML = `<option value="">Select asset</option>`;

  assets.forEach(asset => {
    const option = document.createElement("option");
    option.value = asset.id;
    option.textContent = `${asset.id} — ${asset.assetType} — ${asset.model || ""} — ${asset.assignedTo || "Unassigned"}`;
    transferAsset.appendChild(option);
  });
}

document.getElementById("transferForm").addEventListener("submit", event => {
  event.preventDefault();

  const assetId = document.getElementById("transferAsset").value;
  const newName = document.getElementById("transferTo").value.trim();
  const newEmail = document.getElementById("transferEmail").value.trim();
  const newLocation = document.getElementById("transferLocation").value.trim();
  const note = document.getElementById("transferNotes").value.trim();

  assets = assets.map(asset => {
    if (asset.id !== assetId) return asset;

    const historyItem = {
      type: "Transfer",
      date: new Date().toISOString(),
      fromName: asset.assignedTo || "Unassigned",
      fromEmail: asset.employeeEmail || "",
      toName: newName,
      toEmail: newEmail,
      note
    };

    return {
      ...asset,
      assignedTo: newName,
      employeeEmail: newEmail,
      location: newLocation || asset.location,
      status: "Assigned",
      updatedAt: new Date().toISOString(),
      history: [...(asset.history || []), historyItem]
    };
  });

  saveAssets();
  renderAssets();
  updateTransferOptions();
  event.target.reset();

  alert("Asset transferred successfully.");
});

function escapeForAttribute(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll('"', "&quot;");
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

updateModelOptions();
updateCustomFields();
updateLeaseFields();
renderAssets();
updateTransferOptions();
