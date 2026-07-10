window.HAM = window.HAM || {};

HAM.initializeApp = function () {
  HAM.initializeStorage();
  HAM.initializeLifecycle();

  HAM.initTabs();
  HAM.initCatalog();
  HAM.initInventory();
  HAM.initTransfer();

  HAM.updateModelOptions();
  HAM.renderAssets();
  HAM.updateTransferOptions();
  HAM.renderCatalogManager();

  console.info(
    "HiveOps 3.1A Lifecycle Foundation initialized."
  );
};

document.addEventListener(
  "DOMContentLoaded",
  HAM.initializeApp
);
