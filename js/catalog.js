window.HAM = window.HAM || {};

HAM.updateModelOptions = function (selectedModel = "") {
  const assetTypeSelect = document.getElementById("assetType");
  const modelSelect = document.getElementById("model");

  const type = assetTypeSelect.value;
  const models = HAM.assetCatalog[type] || [];

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
};

HAM.renderCatalogManager = function () {
  const catalogAssetType = document.getElementById("catalogAssetType");
  const catalogModelList = document.getElementById("catalogModelList");
  const catalogModelCount = document.getElementById("catalogModelCount");

  if (!catalogAssetType || !catalogModelList || !catalogModelCount) return;

  const type = catalogAssetType.value;
  const models = HAM.assetCatalog[type] || [];

  catalogModelCount.textContent = `${models.length} model option${models.length === 1 ? "" : "s"} for ${type}.`;
  catalogModelList.innerHTML = "";

  if (!models.length) {
    catalogModelList.innerHTML = `<p class="empty">No models yet for this asset type.</p>`;
    return;
  }

  models.forEach((model, index) => {
    const row = document.createElement("div");
    row.className = "catalog-model-row";

    row.innerHTML = `
      <span>${model}</span>
      <button type="button" onclick="HAM.deleteCatalogModel('${HAM.escapeForAttribute(type)}', ${index})">Delete</button>
    `;

    catalogModelList.appendChild(row);
  });
};

HAM.deleteCatalogModel = function (type, index) {
  if (!confirm("Delete this catalog model? Existing assets will not be changed.")) return;

  HAM.assetCatalog[type].splice(index, 1);
  HAM.saveCatalog();

  if (document.getElementById("assetType").value === type) {
    HAM.updateModelOptions();
  }

  HAM.renderCatalogManager();
};

HAM.initCatalog = function () {
  document.getElementById("assetType").addEventListener("change", HAM.updateModelOptions);

  const catalogAssetType = document.getElementById("catalogAssetType");
  const catalogForm = document.getElementById("catalogForm");
  const exportCatalogButton = document.getElementById("exportCatalog");
  const importCatalogInput = document.getElementById("importCatalog");
  const resetCatalogButton = document.getElementById("resetCatalog");

  if (catalogAssetType) {
    catalogAssetType.addEventListener("change", HAM.renderCatalogManager);
  }

  if (catalogForm) {
    catalogForm.addEventListener("submit", event => {
      event.preventDefault();

      const type = HAM.getValue("catalogAssetType");
      const newModel = HAM.getValue("newCatalogModel").trim();

      if (!newModel) {
        alert("Please enter a model name.");
        return;
      }

      if (!HAM.assetCatalog[type]) {
        HAM.assetCatalog[type] = [];
      }

      const alreadyExists = HAM.assetCatalog[type].some(
        model => model.toLowerCase() === newModel.toLowerCase()
      );

      if (alreadyExists) {
        alert("That model already exists in this asset type.");
        return;
      }

      HAM.assetCatalog[type].push(newModel);
      HAM.saveCatalog();

      if (document.getElementById("assetType").value === type) {
        HAM.updateModelOptions(newModel);
      }

      HAM.setValue("newCatalogModel", "");
      HAM.renderCatalogManager();

      alert("Model added to catalog.");
    });
  }

  if (exportCatalogButton) {
    exportCatalogButton.addEventListener("click", () => {
      HAM.downloadFile("hiveway-asset-catalog.json", JSON.stringify(HAM.assetCatalog, null, 2));
    });
  }

  if (importCatalogInput) {
    importCatalogInput.addEventListener("change", event => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);

          if (typeof imported !== "object" || Array.isArray(imported) || imported === null) {
            alert("Invalid catalog file. Expected an object of asset types and model arrays.");
            return;
          }

          const cleanedCatalog = {};

          Object.keys(HAM.defaultAssetCatalog).forEach(type => {
            cleanedCatalog[type] = Array.isArray(imported[type])
              ? imported[type]
              : HAM.defaultAssetCatalog[type];
          });

          HAM.assetCatalog = cleanedCatalog;
          HAM.saveCatalog();
          HAM.updateModelOptions();
          HAM.renderCatalogManager();

          alert("Catalog imported successfully.");
        } catch {
          alert("Could not read catalog JSON file.");
        }
      };

      reader.readAsText(file);
    });
  }

  if (resetCatalogButton) {
    resetCatalogButton.addEventListener("click", () => {
      if (!confirm("Reset catalog to the default list?")) return;

      HAM.assetCatalog = structuredClone(HAM.defaultAssetCatalog);
      HAM.saveCatalog();
      HAM.updateModelOptions();
      HAM.renderCatalogManager();

      alert("Catalog reset to default.");
    });
  }
};
