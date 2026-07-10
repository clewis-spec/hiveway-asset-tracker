window.HAM = window.HAM || {};

HAM.updateTransferOptions = function () {
  const transferAsset =
    document.getElementById("transferAsset");

  if (!transferAsset) {
    return;
  }

  transferAsset.innerHTML =
    `<option value="">Select asset</option>`;

  HAM.assets.forEach(asset => {
    const option =
      document.createElement("option");

    option.value = asset.id;

    option.textContent =
      `${asset.id} — ` +
      `${asset.assetType} — ` +
      `${asset.model || ""} — ` +
      `${asset.assignedTo || "Unassigned"}`;

    transferAsset.appendChild(option);
  });
};

HAM.initTransfer = function () {
  const transferForm =
    document.getElementById("transferForm");

  if (!transferForm) {
    return;
  }

  transferForm.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const assetId =
        HAM.getValue("transferAsset");

      const newName =
        HAM.getValue("transferTo").trim();

      const newEmail =
        HAM.getValue("transferEmail").trim();

      const newLocation =
        HAM.getValue("transferLocation").trim();

      const note =
        HAM.getValue("transferNotes").trim();

      const existingAsset =
        HAM.assets.find(
          asset => asset.id === assetId
        );

      if (!existingAsset) {
        alert("Please select a valid asset.");
        return;
      }

      if (!newName) {
        alert(
          "Please enter the new employee name."
        );
        return;
      }

      HAM.assets = HAM.assets.map(asset => {
        if (asset.id !== assetId) {
          return asset;
        }

        return {
          ...asset,
          assignedTo: newName,
          employeeEmail: newEmail,
          location:
            newLocation || asset.location,
          status: "Assigned",
          updatedAt:
            new Date().toISOString()
        };
      });

      HAM.addLifecycleEvent({
        assetId,
        type: "Transferred",
        description:
          note ||
          `Asset transferred to ${newName}.`,
        metadata: {
          fromName:
            existingAsset.assignedTo ||
            "Unassigned",
          fromEmail:
            existingAsset.employeeEmail ||
            "",
          toName: newName,
          toEmail: newEmail,
          previousLocation:
            existingAsset.location || "",
          newLocation:
            newLocation ||
            existingAsset.location ||
            ""
        }
      });

      HAM.saveAssets();
      HAM.renderAssets();
      HAM.updateTransferOptions();

      event.target.reset();

      alert(
        "Asset transferred successfully."
      );
    }
  );
};
