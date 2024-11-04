chrome.action.onClicked.addListener(async () => {
    console.log("Extension icon clicked.");
    try {
        const clipboardContents = await navigator.clipboard.readText();
        console.log(`Clipboard contents retrieved: ${clipboardContents}`);
        
        await handleClipboardContents(clipboardContents);
    } catch (error) {
        console.error("Error accessing clipboard contents:", error);
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


        await navigator.clipboard.writeText(searchUrl);
        console.log("Search URL copied to clipboard.");


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

async function detectPattern(text) {
    console.log(`Detecting pattern for text: ${text}`);
    
    const userIdPattern = /^[a-zA-Z0-9_-]{8,20}$/; // Example userId pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    const phoneNumberPattern = /^\d{10}$/; // Simple 10-digit phone number pattern

    if (userIdPattern.test(text)) {
        console.log("Pattern detected as userId.");
        return 'userId';
    } else if (emailPattern.test(text)) {
        console.log("Pattern detected as email.");
        return 'email';
    } else if (phoneNumberPattern.test(text.replace(/\D/g, ''))) {
        console.log("Pattern detected as phoneNumber.");
        return 'phoneNumber';
    } else {
        console.log("Pattern defaulting to name.");
        return 'name'; 
    }
}

function sanitizeTextForPhoneNumber(text) {
    const sanitizedText = text.replace(/\D/g, '');
    console.log(`Sanitized text for phone number: ${sanitizedText}`);
    return sanitizedText;
}
