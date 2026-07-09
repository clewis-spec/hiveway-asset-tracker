window.HAM = window.HAM || {};

HAM.initializeApp = function () {
  HAM.initTabs();
  HAM.initCatalog();
  HAM.initInventory();
  HAM.initTransfer();

  HAM.updateModelOptions();
  HAM.renderAssets();
  HAM.updateTransferOptions();
  HAM.renderCatalogManager();
};

document.addEventListener("DOMContentLoaded", HAM.initializeApp);
