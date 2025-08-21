FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    build-essential

# Install Node.js 20 (LTS) and latest npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set main work directory
WORKDIR /app

# Copy project files first
COPY . /app/

# Install React dependencies and build React
WORKDIR /app/reat_project
RUN npm install && npm run build

# Back to Django project root
WORKDIR /app

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Collect Django static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run Django with Gunicorn
CMD ["sh", "-c", "gunicorn main_project.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]
