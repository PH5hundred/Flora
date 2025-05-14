document.getElementById("scanButton").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const container = document.getElementById("itemsContainer");
    container.innerHTML = "Scanning...";
  
    if (!fileInput.files.length) {
      container.innerText = "Please select an image.";
      return;
    }
  
    const image = fileInput.files[0];
    const result = await Tesseract.recognize(image, 'eng');
    const lines = result.data.text.split('\n').filter(line => line.trim());
  
    container.innerHTML = "";
    lines.forEach((line, index) => {
      const dollarMatch = line.match(/\$(\d+(\.\d+)?)/);
      const price = dollarMatch ? parseFloat(dollarMatch[1]) : null;
  
      const lineDiv = document.createElement("div");
      lineDiv.className = "line-item";
  
      const originalText = document.createElement("span");
      originalText.textContent = line;
      originalText.className = "original";
  
      const stemsInput = document.createElement("input");
      stemsInput.type = "number";
      stemsInput.value = 10;
      stemsInput.className = "stems-input";
      stemsInput.title = "Stems per bunch";
  
      const resultSpan = document.createElement("span");
      resultSpan.className = "result";
  
      lineDiv.appendChild(originalText);
      if (price !== null) {
        lineDiv.appendChild(document.createTextNode(" | Stems: "));
        lineDiv.appendChild(stemsInput);
        lineDiv.appendChild(document.createTextNode(" → "));
        lineDiv.appendChild(resultSpan);
        lineDiv.dataset.price = price;
      }
  
      container.appendChild(lineDiv);
    });
  });
  
  document.getElementById("applyMarkup").addEventListener("click", () => {
    const markup = parseFloat(document.getElementById("markupInput").value) || 0;
    const items = document.querySelectorAll(".line-item");
  
    items.forEach(item => {
      const price = parseFloat(item.dataset.price);
      const stemsInput = item.querySelector(".stems-input");
      const resultSpan = item.querySelector(".result");
  
      if (price && stemsInput && resultSpan) {
        const stems = parseFloat(stemsInput.value) || 1;
        const perFlower = price / stems;
        const withMarkup = perFlower * (1 + markup / 100);
        resultSpan.textContent = `$${withMarkup.toFixed(2)} per flower`;
      }
    });
  });
  