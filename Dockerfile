# Use an official Python image as the base
FROM python:3.11-slim

# Install necessary packages for clipboard access
RUN apt-get update && \
    apt-get install -y xclip xsel && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the Python script and requirements
COPY UniversalClipboard.py /app/UniversalClipboard.py
COPY requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the Python script
CMD ["python", "/app/UniversalClipboard.py"]
