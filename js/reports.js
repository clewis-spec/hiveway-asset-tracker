window.HAM = window.HAM || {};

HAM.renderReports = function () {
  HAM.renderGroupedReport("employeeReport", HAM.groupByEmployee());
  HAM.renderGroupedReport("statusReport", HAM.groupByField("status"));
  HAM.renderGroupedReport("typeReport", HAM.groupByField("assetType"));
};

HAM.groupByEmployee = function () {
  const groups = {};

  HAM.assets.forEach(asset => {
    const name = asset.assignedTo || "Unassigned";
    const email = asset.employeeEmail || "";
    const key = `${name}|${email}`;

    if (!groups[key]) {
      groups[key] = { label: name, email, count: 0 };
    }

    groups[key].count += 1;
  });

  return Object.values(groups);
};

HAM.groupByField = function (field) {
  const groups = {};

  HAM.assets.forEach(asset => {
    const label = asset[field] || "Unknown";

    if (!groups[label]) {
      groups[label] = { label, count: 0 };
    }

    groups[label].count += 1;
  });

  return Object.values(groups);
};

HAM.renderGroupedReport = function (elementId, rows) {
  const body = document.getElementById(elementId);
  if (!body) return;

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
            <span class="report-link" onclick="HAM.showEmployeeAssets('${HAM.escapeForAttribute(row.label)}', '${HAM.escapeForAttribute(row.email || "")}')">
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
};

HAM.showEmployeeAssets = function (name, email) {
  const employeeAssets = HAM.assets.filter(asset =>
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
            Location: ${asset.location || ""}
          </p>
          <h4>History</h4>
          ${historyHtml}
        </section>
        <hr>
      `;
    })
    .join("");

  HAM.openPopup(
    `${name} Assets`,
    `
      <h1>${name}</h1>
      <p>${email || ""}</p>
      <h2>Assigned Assets</h2>
      ${list || "<p>No assets assigned.</p>"}
    `
  );
};
