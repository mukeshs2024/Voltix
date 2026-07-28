FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /app

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Command to run the simulation or API server
# (Using runner.py as the default entrypoint for now)
CMD ["python", "-m", "simulation.runner"]
