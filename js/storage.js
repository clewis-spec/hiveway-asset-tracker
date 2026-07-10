window.HAM = window.HAM || {};

HAM.ASSET_STORAGE_KEY = "hivewayAssets";
HAM.CATALOG_STORAGE_KEY = "hivewayAssetCatalog";

HAM.assets = [];
HAM.assetCatalog = {};

HAM.loadAssets = function () {
  try {
    const storedAssets = JSON.parse(
      localStorage.getItem(HAM.ASSET_STORAGE_KEY)
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
      localStorage.getItem(HAM.CATALOG_STORAGE_KEY)
    );

    const isValidCatalog =
      storedCatalog &&
      typeof storedCatalog === "object" &&
      !Array.isArray(storedCatalog);

    HAM.assetCatalog = isValidCatalog
      ? storedCatalog
      : structuredClone(HAM.defaultAssetCatalog);
  } catch (error) {
    console.error("Could not load asset catalog:", error);

    HAM.assetCatalog =
      structuredClone(HAM.defaultAssetCatalog);
  }
};

HAM.saveAssets = function () {
  if (typeof HAM.ensureOwnership === "function") {
    HAM.assets = HAM.assets.map(asset =>
      HAM.ensureOwnership(asset)
    );
  }

  localStorage.setItem(
    HAM.ASSET_STORAGE_KEY,
    JSON.stringify(HAM.assets)
  );
};

HAM.saveCatalog = function () {
  localStorage.setItem(
    HAM.CATALOG_STORAGE_KEY,
    JSON.stringify(HAM.assetCatalog)
  );
};

HAM.downloadFile = function (
  filename,
  content,
  mimeType = "text/plain"
) {
  const blob = new Blob(
    [content],
    { type: mimeType }
  );

  const objectUrl =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

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
