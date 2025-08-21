# --------------------------
# Stage 1: Build React Frontend
# --------------------------
FROM node:20 AS frontend

WORKDIR /app/frontend

# Copy only React files first for better caching
COPY reat_project/package*.json ./
RUN npm install

# Copy rest of React app and build
COPY reat_project/ ./
RUN npm run build


# --------------------------
# Stage 2: Django Backend
# --------------------------
FROM python:3.11-slim AS backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project files
COPY . .

# Copy built React frontend into Django static directory
COPY --from=frontend /app/frontend/build ./reat_project/build

# Debug step (will show in build logs)
RUN python -m django --version
RUN python manage.py help

# Run checks
RUN python manage.py check

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port (Railway will override with its own $PORT)
EXPOSE 8000


# Start with gunicorn
CMD ["sh", "-c", "gunicorn main_project.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]
