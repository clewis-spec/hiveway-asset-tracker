const form = document.getElementById("assetForm");
const table = document.getElementById("assetTable");
const search = document.getElementById("search");
const assetTypeSelect = document.getElementById("assetType");
const modelSelect = document.getElementById("model");

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
  "Other": ["Other"]
};

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

assetTypeSelect.addEventListener("change", () => updateModelOptions());

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
    "Other": "HW-OTH"
  };

  return map[type] || "HW-AST";
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
      <td><span class="badge ${asset.status}">${asset.status}</span></td>
      <td>${asset.location || ""}</td>
      <td>
        <button onclick="editAsset('${asset.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteAsset('${asset.id}')">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });

  document.getElementById("emptyState").style.display =
    filteredAssets.length ? "none" : "block";

  updateStats();
  renderReports();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const editingId = document.getElementById("editingId").value;
  const serialNumber = document.getElementById("serialNumber").value.trim();

  const duplicate = assets.find(asset =>
    asset.serialNumber.toLowerCase() === serialNumber.toLowerCase() &&
    asset.id !== editingId
  );

  if (duplicate) {
    alert("This serial number / unique ID already exists.");
    return;
  }

  const type = assetTypeSelect.value;

  const assetData = {
    assetType: type,
    model: modelSelect.value,
    serialNumber,
    assignedTo: document.getElementById("assignedTo").value,
    employeeEmail: document.getElementById("employeeEmail").value,
    status: document.getElementById("status").value,
    location: document.getElementById("location").value,
    notes: document.getElementById("notes").value,
    updatedAt: new Date().toISOString()
  };

  if (editingId) {
    assets = assets.map(asset =>
      asset.id === editingId ? { ...asset, ...assetData } : asset
    );
  } else {
    assets.push({
      id: generateAssetId(type),
      ...assetData,
      createdAt: new Date().toISOString()
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
  assetTypeSelect.value = asset.assetType;
  updateModelOptions(asset.model);

  document.getElementById("serialNumber").value = asset.serialNumber;
  document.getElementById("assignedTo").value = asset.assignedTo || "";
  document.getElementById("employeeEmail").value = asset.employeeEmail || "";
  document.getElementById("status").value = asset.status;
  document.getElementById("location").value = asset.location || "";
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
}

document.getElementById("cancelEdit").addEventListener("click", resetForm);

function deleteAsset(id) {
  if (!confirm("Delete this asset?")) return;

  assets = assets.filter(asset => asset.id !== id);
  saveAssets();
  renderAssets();
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
    "location",
    "notes",
    "createdAt",
    "updatedAt"
  ];

  const rows = assets.map(asset =>
    headers.map(header => `"${String(asset[header] || "").replaceAll('"', '""')}"`).join(",")
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

      assets = imported;
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
    const label = asset[field] || "Unknown";

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
          <td>${row.label}</td>
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

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

updateModelOptions();
renderAssets();
