chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getClipboardText") {
        navigator.clipboard.readText().then((text) => {
            console.log("Clipboard contents read by content script:", text);
            sendResponse({ clipboardContents: text });
        }).catch((error) => {
            console.error("Failed to read clipboard contents:", error);
            sendResponse({ clipboardContents: null });
        });
        return true; // Keep the response channel open for async
    }
});
