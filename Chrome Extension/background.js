chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "processClipboard") {
        console.log("Clipboard contents received from content script:", message.clipboardContents);
        handleClipboardContents(message.clipboardContents);
    }
});

async function handleClipboardContents(clipboardContents) {
    console.log(`Processing clipboard contents: ${clipboardContents}`);

    try {
        const sanitizedClipboard = sanitizeTextForPhoneNumber(clipboardContents);
        console.log(`Sanitized clipboard content: ${sanitizedClipboard}`);

        let searchType, searchTerm;
        const baseUrl = "https://support-dashboard.fetchrewards.com/support/user";

        const pattern = await detectPattern(clipboardContents);
        console.log(`Detected pattern: ${pattern}`);

        if (pattern === 'userId') {
            searchType = 'userId';
            searchTerm = clipboardContents;
        } else if (['email', 'name'].includes(pattern)) {
            searchType = 'general';
            searchTerm = encodeURIComponent(clipboardContents.trim());
        } else if (await detectPattern(sanitizedClipboard) === 'phoneNumber') {
            searchType = 'phoneNumber';
            searchTerm = sanitizedClipboard;
        } else {
            console.warn("Unrecognized clipboard content pattern.");
            return;
        }

        const searchUrl = `${baseUrl}?searchType=${searchType}&searchTerm=${searchTerm}`;
        console.log(`Generated search URL: ${searchUrl}`);

        // Copy the search URL back to the clipboard
        await navigator.clipboard.writeText(searchUrl);
        console.log("Search URL copied to clipboard.");

        // Open the search URL in a new window
        console.log("Opening search URL in a new window.");
        chrome.windows.create({
            url: searchUrl,
            type: "popup",
            left: screen.availWidth - 400,
            width: 400,
            height: screen.availHeight
        });
    } catch (error) {
        console.error("Error processing clipboard contents:", error);
    }
}

// The remaining functions (detectPattern and sanitizeTextForPhoneNumber) remain the same as previously provided
