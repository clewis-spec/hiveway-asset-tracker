window.HAM = window.HAM || {};

HAM.assets = JSON.parse(localStorage.getItem("hivewayAssets")) || [];

HAM.assetCatalog =
  JSON.parse(localStorage.getItem("hivewayAssetCatalog")) ||
  structuredClone(HAM.defaultAssetCatalog);

HAM.saveAssets = function () {
  localStorage.setItem("hivewayAssets", JSON.stringify(HAM.assets));
};

HAM.saveCatalog = function () {
  localStorage.setItem("hivewayAssetCatalog", JSON.stringify(HAM.assetCatalog));
};

HAM.downloadFile = function (filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
