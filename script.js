function generateZip() {
  if (selectedFiles.length === 0) {
    alert("Vennligst last opp PDF-filer først.");
    return;
  }

  const zip = new JSZip();

  const style = `
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f0f2f5;
      margin: 40px 20px;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h2 {
      margin-bottom: 30px;
      font-weight: 700;
      color: #222;
    }
    #pdf-list {
      display: flex;
      gap: 25px;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 960px;
    }
    .pdf-card {
      background: #fff;
      width: 260px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 25px 20px 30px;
      transition: transform 0.25s ease, box-shadow 0.3s ease;
      user-select: none;
      text-decoration: none;
    }
    .pdf-card:hover {
      box-shadow: 0 12px 28px rgba(0,0,0,0.18);
      transform: translateY(-6px);
    }
    .pdf-icon {
      width: 80px;
      height: 110px;
      background: linear-gradient(135deg, #4a90e2 0%, #357ABD 100%);
      border-radius: 6px;
      box-shadow: 0 6px 12px rgba(53, 122, 189, 0.6);
      position: relative;
      margin-bottom: 18px;
    }
    .pdf-icon::before {
      content: "";
      position: absolute;
      top: 12px;
      left: 16px;
      width: 48px;
      height: 76px;
      background: #fff;
      border-radius: 2px;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    }
    .pdf-icon::after {
      content: "";
      position: absolute;
      top: 12px;
      left: 56px;
      width: 12px;
      height: 12px;
      background: #cfd9e9;
      clip-path: polygon(0 0, 100% 0, 100% 100%);
      border-radius: 0 2px 0 0;
      box-shadow: inset 0 0 3px rgba(0,0,0,0.15);
    }
    .pdf-title {
      font-size: 1rem;
      font-weight: 600;
      text-align: center;
      color: #222;
      line-height: 1.3;
    }
  `;

  let indexHtml = `
    <!DOCTYPE html>
    <html lang="no">
    <head>
      <meta charset="UTF-8">
      <title>PDF Samling</title>
      <style>${style}</style>
    </head>
    <body>
      <h2>Mine PDF-er</h2>
      <div id="pdf-list">
  `;

  const readPromises = selectedFiles.map(file =>
    file.arrayBuffer().then(buffer => {
      zip.file(file.name, buffer);
      const title = file.name.replace(/\.pdf$/i, "").replace(/[_\-]/g, " ");
      indexHtml += `
        <a href="${file.name}" class="pdf-card" target="_blank" rel="noopener noreferrer">
          <div class="pdf-icon"></div>
          <div class="pdf-title">${title}</div>
        </a>
      `;
    })
  );

  Promise.all(readPromises).then(() => {
    indexHtml += `</div></body></html>`;
    zip.file("index.html", indexHtml);

    document.getElementById("status").innerText = "Lager ZIP-fil...";

    zip.generateAsync({ type: "blob" }).then(content => {
      saveAs(content, "pdf-samling.zip");
      document.getElementById("status").innerText = "Ferdig! ZIP lastet ned.";
    });
  });
}
