# Base image with Python
FROM python:3.11-slim

# Install system dependencies first
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18 and latest npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy everything
COPY . /app/

# Install React dependencies and build
RUN npm install --prefix reat_project && \
    npm run build --prefix reat_project

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Collect Django static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Start Django with Gunicorn
CMD ["gunicorn", "main_project.wsgi:application", "--bind", "0.0.0.0:8000"]
