async function recognizeTextFromImage(imageFile) {
    if (!imageFile) {
        alert("Please upload an image first.");
        return;
    }

    document.getElementById("output").innerText = "Scanning... Please wait.";

    try {
        const { data: { text } } = await Tesseract.recognize(
            imageFile,
            'eng',
            { logger: m => console.log(m) } // Logs progress
        );

        document.getElementById("output").innerText = text || "No text detected.";
    } catch (error) {
        console.error("Error recognizing text:", error);
        document.getElementById("output").innerText = "Error extracting text.";
    }
}

function applyMarkup() {
    let extractedText = document.getElementById("output").innerText;
    let markupPercentage = parseFloat(document.getElementById("markupInput").value);

    if (isNaN(markupPercentage) || markupPercentage <= 0) {
        alert("Please enter a valid markup percentage.");
        return;
    }

    let lines = extractedText.split("\n");
    let updatedLines = lines.map(line => {
        let words = line.split(" ");
        let updatedWords = words.map(word => {
            let num = parseFloat(word);
            if (!isNaN(num)) {
                return (num + (num * markupPercentage / 100)).toFixed(2);
            }
            return word;
        });
        return updatedWords.join(" ");
    });

    document.getElementById("finalOutput").innerText = updatedLines.join("\n");
}

document.getElementById("scanButton").addEventListener("click", function() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    recognizeTextFromImage(file);
});

document.getElementById("applyMarkup").addEventListener("click", applyMarkup);
