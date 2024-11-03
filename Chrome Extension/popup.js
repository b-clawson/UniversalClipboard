document.getElementById("checkClipboard").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.textContent = "Checking clipboard...";

    try {
        console.log("Attempting to read clipboard...");
        const clipboardText = await navigator.clipboard.readText();
        console.log("Clipboard text retrieved:", clipboardText);

        chrome.runtime.sendMessage({ action: "processClipboard", clipboardText }, (response) => {
            console.log("Response from background script:", response);
            if (response && response.message) {
                status.textContent = response.message;
            } else {
                status.textContent = "Unrecognized clipboard content.";
            }
        });
    } catch (error) {
        console.error("Failed to read clipboard:", error);
        status.textContent = "Failed to read clipboard.";
    }
});
