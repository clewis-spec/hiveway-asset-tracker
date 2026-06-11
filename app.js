const form = document.getElementById("assetForm");
const table = document.getElementById("assetTable");
const search = document.getElementById("search");

let assets = JSON.parse(localStorage.getItem("hivewayAssets")) || [];

function saveAssets() {
  localStorage.setItem("hivewayAssets", JSON.stringify(assets));
}

function renderAssets() {
  const query = search.value.toLowerCase();

  table.innerHTML = "";

  assets
    .filter(asset =>
      JSON.stringify(asset).toLowerCase().includes(query)
    )
    .forEach(asset => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${asset.assetType}</td>
        <td>${asset.model}</td>
        <td>${asset.serialNumber}</td>
        <td>${asset.assignedTo}</td>
        <td>${asset.status}</td>
        <td>${asset.location}</td>
        <td>
          <button
            class="delete-btn"
            onclick="deleteAsset('${asset.id}')"
          >
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);
    });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const asset = {
    id: crypto.randomUUID(),
    assetType: document.getElementById("assetType").value,
    model: document.getElementById("model").value,
    serialNumber: document.getElementById("serialNumber").value,
    assignedTo: document.getElementById("assignedTo").value,
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
  assets = assets.filter(asset => asset.id !== id);

  saveAssets();
  renderAssets();
}

search.addEventListener("input", renderAssets);

document.getElementById("exportJson")
  .addEventListener("click", () => {

    const content = JSON.stringify(
      assets,
      null,
      2
    );

    downloadFile(
      "hiveway-assets.json",
      content
    );
});

document.getElementById("exportCsv")
  .addEventListener("click", () => {

    const headers = [
      "assetType",
      "model",
      "serialNumber",
      "assignedTo",
      "status",
      "location",
      "notes",
      "createdAt"
    ];

    const rows = assets.map(asset =>
      headers
        .map(header => `"${asset[header] || ""}"`)
        .join(",")
    );

    const csv = [
      headers.join(","),
      ...rows
    ].join("\n");

    downloadFile(
      "hiveway-assets.csv",
      csv
    );
});

function downloadFile(filename, content) {
  const blob = new Blob(
    [content],
    { type: "text/plain" }
  );

  const link = document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download = filename;

  link.click();
}

renderAssets();
