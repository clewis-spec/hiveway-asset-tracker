window.HAM = window.HAM || {};

HAM.updateTransferOptions = function () {
  const transferAsset = document.getElementById("transferAsset");
  if (!transferAsset) return;

  transferAsset.innerHTML = `<option value="">Select asset</option>`;

  HAM.assets.forEach(asset => {
    const option = document.createElement("option");
    option.value = asset.id;
    option.textContent = `${asset.id} — ${asset.assetType} — ${asset.model || ""} — ${asset.assignedTo || "Unassigned"}`;
    transferAsset.appendChild(option);
  });
};

HAM.initTransfer = function () {
  const transferForm = document.getElementById("transferForm");

  if (!transferForm) return;

  transferForm.addEventListener("submit", event => {
    event.preventDefault();

    const assetId = HAM.getValue("transferAsset");
    const newName = HAM.getValue("transferTo").trim();
    const newEmail = HAM.getValue("transferEmail").trim();
    const newLocation = HAM.getValue("transferLocation").trim();
    const note = HAM.getValue("transferNotes").trim();

    HAM.assets = HAM.assets.map(asset => {
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

    HAM.saveAssets();
    HAM.renderAssets();
    HAM.updateTransferOptions();
    event.target.reset();

    alert("Asset transferred successfully.");
  });
};
