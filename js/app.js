window.HAM = window.HAM || {};

HAM.initializeApp = function () {
  /*
   * Required startup order:
   *
   * 1. Load stored data.
   * 2. Load and migrate lifecycle data.
   * 3. Normalize ownership data.
   * 4. Attach user-interface listeners.
   * 5. Render the application.
   */

  HAM.initializeStorage();
  HAM.initializeLifecycle();
  HAM.initializeOwnership();

  HAM.initTabs();
  HAM.initCatalog();
  HAM.initOwnershipUI();
  HAM.initInventory();
  HAM.initTransfer();

  HAM.updateModelOptions();
  HAM.renderAssets();
  HAM.updateTransferOptions();
  HAM.renderCatalogManager();

  console.info(
    `HiveOps ${HAM.APP_VERSION} Ownership UI initialized.`
  );

  console.info(
    `${HAM.assets.length} asset(s) loaded.`
  );

  console.info(
    `${HAM.getAssetsWithoutOwnership().length} asset(s) require ownership classification.`
  );
};

document.addEventListener(
  "DOMContentLoaded",
  HAM.initializeApp
);
