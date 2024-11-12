document.getElementById("searchButton").addEventListener("click", () => {
    const status = document.getElementById("status");
    const inputField = document.getElementById("inputField").value.trim();

    if (inputField) {
        console.log("Search term entered:", inputField);
        chrome.runtime.sendMessage({
            action: "processClipboard",
            clipboardContents: inputField
        }, (response) => {
            console.log("Response from background script:", response);
            if (response && response.message) {
                status.textContent = response.message;
            } else {
                status.textContent = "Search completed.";
            }
        });
        status.textContent = "Search initiated...";
    } else {
        status.textContent = "Please enter a valid search term.";
    }
});
