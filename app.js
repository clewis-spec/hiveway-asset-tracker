const form = document.getElementById("assetForm");
const table = document.getElementById("assetTable");
const search = document.getElementById("search");

let assets = JSON.parse(localStorage.getItem("hivewayAssets")) || [];

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

  const count =
    assets.filter(asset => asset.id && asset.id.startsWith(prefix)).length + 1;

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

  table.innerHTML = "";

  assets
    .filter(asset => JSON.stringify(asset).toLowerCase().includes(query))
    .forEach(asset => {
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
          <button class="delete-btn" onclick="deleteAsset('${asset.id}')">
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);
    });

  updateStats();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const type = document.getElementById("assetType").value;

  const asset = {
    id: generateAssetId(type),
    assetType: type,
    model: document.getElementById("model").value,
    serialNumber: document.getElementById("serialNumber").value,
    assignedTo: document.getElementById("assignedTo").value,
    employeeEmail: document.getElementById("employeeEmail").value,
    status: document.getElementById("status").value,
    location: document.getElementById("location").value,
    notes: document.getElementById("notes").value,
    createdAt: new Date().toISOString()
  };

  assets.push(asset);
  saveAssets();
  renderAssets();
  form.reset();
});

function deleteAsset(id) {
  if (!confirm("Delete this asset?")) return;

  assets = assets.filter(asset => asset.id !== id);
  saveAssets();
  renderAssets();
}

search.addEventListener("input", renderAssets);

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
    "createdAt"
  ];

  const rows = assets.map(asset =>
    headers.map(header => `"${asset[header] || ""}"`).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  downloadFile("hiveway-assets.csv", csv);
});

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

renderAssets();
