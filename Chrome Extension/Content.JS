chrome.action.onClicked.addListener(async () => {
    try {
        const clipboardContents = await navigator.clipboard.readText();
        console.log("Clipboard contents read in content script:", clipboardContents);

        // Send clipboard contents to background script
        chrome.runtime.sendMessage({
            action: "processClipboard",
            clipboardContents: clipboardContents
        });
    } catch (error) {
        console.error("Error reading clipboard in content script:", error);
    }
});
