async function detectPattern(text) {
    const patterns = {
        userId: /^[0-9a-fA-F]{24}$/,
        email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        name: /^[A-Za-z]+( [A-Za-z]+)+$/,
        phoneNumber: /^[0-9]{10}$/
    };

    console.log("Detecting pattern for text:", text);

    for (let key in patterns) {
        if (patterns[key].test(text)) {
            console.log(`Pattern detected: ${key}`);
            return key;
        }
    }
    console.log("No pattern detected.");
    return null;
}

function sanitizeTextForPhoneNumber(text) {
    const sanitizedText = text.replace(/\D/g, '');
    console.log("Sanitized text for phone number:", sanitizedText);
    return sanitizedText;
}

async function handleClipboardContents(clipboardContents, openOption) {
    console.log(`Processing clipboard contents: ${clipboardContents} with option: ${openOption}`);

    try {
        const sanitizedClipboard = sanitizeTextForPhoneNumber(clipboardContents);
        let searchType, searchTerm;
        const baseUrl = "https://support-dashboard.fetchrewards.com/support/user";

        const pattern = await detectPattern(clipboardContents);
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
            console.log("Unrecognized clipboard content.");
            return;
        }

        const searchUrl = `${baseUrl}?searchType=${searchType}&searchTerm=${searchTerm}`;
        console.log(`Generated search URL: ${searchUrl}`);

        await navigator.clipboard.writeText(searchUrl);
        console.log("Search URL copied to clipboard.");

        // Open in a new tab or new window based on user choice
        if (openOption === "tab") {
            chrome.tabs.create({ url: searchUrl });
        } else if (openOption === "window") {
            chrome.windows.create({
                url: searchUrl,
                type: "popup",
                left: screen.availWidth - 400, // Align window to the right
                width: 400,
                height: screen.availHeight
            });
        }
    } catch (error) {
        console.error("Error in handleClipboardContents:", error);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in background script:", request);

    if (request.action === "processClipboard") {
        handleClipboardContents(request.clipboardText, request.openOption)
            .then(() => {
                console.log("Clipboard processed successfully.");
                sendResponse({ message: "Search URL generated and opened." });
            })
            .catch((error) => {
                console.error("Error processing clipboard:", error);
                sendResponse({ message: "Error processing clipboard content." });
            });
        return true; // Keeps the message channel open for async response
    }
});
