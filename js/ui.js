window.HAM = window.HAM || {};

HAM.getValue = function (id) {
  const element = document.getElementById(id);
  return element ? element.value : "";
};

HAM.setValue = function (id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value || "";
};

HAM.escapeForAttribute = function (value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll('"', "&quot;");
};

HAM.initTabs = function () {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
      document.querySelectorAll(".tab-view").forEach(view => view.classList.remove("active-view"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active-view");
    });
  });
};

HAM.openPopup = function (title, bodyHtml) {
  const popup = window.open("", "_blank", "width=760,height=850");

  popup.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #111827;
            background: #f8fafc;
          }

          h1, h2, h3 {
            color: #4b4f5c;
          }

          section {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 18px;
            margin-bottom: 18px;
          }

          hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 20px 0;
          }

          .transfer-history {
            margin-top: 12px;
            padding: 12px;
            border-radius: 12px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>${bodyHtml}</body>
    </html>
  `);
};
