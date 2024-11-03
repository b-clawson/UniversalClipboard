from flask import Flask, request, render_template, redirect, url_for
import re
import urllib.parse

app = Flask(__name__)

# Patterns for validating input
patterns = {
    "userId": r"^[0-9a-fA-F]{24}$",
    "email": r"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$",
    "name": r"^[A-Za-z]+( [A-Za-z]+)+$",
    "phoneNumber": r"^[0-9]{10}$"
}

# Function to detect pattern type
def detect_pattern(text, patterns_dict):
    for key, pattern in patterns_dict.items():
        if re.match(pattern, text, re.IGNORECASE):
            return key
    return None

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_input = request.form['user_input']
        
        # Sanitize input for phone numbers
        sanitized_input = re.sub(r"\D", "", user_input)
        
        # Detect pattern type and generate URL
        base_url = "https://support-dashboard.fetchrewards.com/support/user"
        search_type = None
        search_term = None

        if detect_pattern(user_input, {"userId": patterns["userId"]}):
            search_type = "userId"
            search_term = user_input
        elif detect_pattern(user_input, {"email": patterns["email"], "name": patterns["name"]}):
            search_type = "general"
            search_term = urllib.parse.quote(user_input.strip())
        elif detect_pattern(sanitized_input, {"phoneNumber": patterns["phoneNumber"]}):
            search_type = "phoneNumber"
            search_term = sanitized_input
        else:
            return render_template('index.html', error="Unrecognized input format.")

        # Generate the final URL
        query_params = {
            "searchType": search_type,
            "searchTerm": search_term
        }
        search_url = f"{base_url}?{urllib.parse.urlencode(query_params)}"
        
        # Render the URL result
        return render_template('index.html', search_url=search_url)
    
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
