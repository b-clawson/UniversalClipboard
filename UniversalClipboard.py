import re
import urllib.parse
import pyperclip
import webbrowser

clipboard_contents = pyperclip.paste()
print(f"Clipboard Contents: {clipboard_contents}")

patterns = {
    "userId": r"^[0-9a-fA-F]{24}$",
    "email": r"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$",
    "name": r"^[A-Za-z]+( [A-Za-z]+)+$",
    "phoneNumber": r"^[0-9]{10}$"
}

sanitized_clipboard = re.sub(r"\D", "", clipboard_contents)
print(f"Sanitized Clipboard for Phone Number: {sanitized_clipboard}")

def detect_pattern(text, patterns_dict):
    for key, pattern in patterns_dict.items():
        if re.match(pattern, text, re.IGNORECASE):
            print(f"Pattern matched: {key}")
            return key
    return None

base_url = "https://support-dashboard.fetchrewards.com/support/user"
search_type = None
search_term = None

if detect_pattern(clipboard_contents, {"userId": patterns["userId"]}):
    search_type = "userId"
    search_term = clipboard_contents
elif detect_pattern(clipboard_contents, {"email": patterns["email"], "name": patterns["name"]}):
    search_type = "general"
    search_term = urllib.parse.quote(clipboard_contents.strip())
elif detect_pattern(sanitized_clipboard, {"phoneNumber": patterns["phoneNumber"]}):
    search_type = "phoneNumber"
    search_term = sanitized_clipboard
else:
    print("Unrecognized clipboard content. It does not match User ID, email, name, or phone number.")
    exit()

query_params = {
    "searchType": search_type,
    "searchTerm": search_term
}
search_url = f"{base_url}?{urllib.parse.urlencode(query_params)}"
print(f"Generated Search URL: {search_url}")

pyperclip.copy(search_url)
print("Search URL copied to clipboard.")

webbrowser.open_new(search_url)
print("Opened URL in browser.")
