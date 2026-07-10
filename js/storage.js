window.HAM = window.HAM || {};

HAM.assets = [];

HAM.assetCatalog = {};

HAM.loadAssets = function () {
  try {
    const storedAssets = JSON.parse(
      localStorage.getItem("hivewayAssets")
    );

    HAM.assets = Array.isArray(storedAssets)
      ? storedAssets
      : [];
  } catch (error) {
    console.error("Could not load assets:", error);
    HAM.assets = [];
  }
};

HAM.loadCatalog = function () {
  try {
    const storedCatalog = JSON.parse(
      localStorage.getItem("hivewayAssetCatalog")
    );

    HAM.assetCatalog =
      storedCatalog &&
      typeof storedCatalog === "object" &&
      !Array.isArray(storedCatalog)
        ? storedCatalog
        : structuredClone(HAM.defaultAssetCatalog);
  } catch (error) {
    console.error("Could not load asset catalog:", error);

    HAM.assetCatalog =
      structuredClone(HAM.defaultAssetCatalog);
  }
};

HAM.saveAssets = function () {
  localStorage.setItem(
    "hivewayAssets",
    JSON.stringify(HAM.assets)
  );
};

HAM.saveCatalog = function () {
  localStorage.setItem(
    "hivewayAssetCatalog",
    JSON.stringify(HAM.assetCatalog)
  );
};

HAM.downloadFile = function (filename, content, mimeType = "text/plain") {
  const blob = new Blob([content], {
    type: mimeType
  });

  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);

  link.href = objectUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(objectUrl);
};

HAM.initializeStorage = function () {
  HAM.loadAssets();
  HAM.loadCatalog();
};
