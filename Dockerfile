# --------------------------
# Stage 1: Build React Frontend
# --------------------------
FROM node:20 AS frontend

WORKDIR /app/frontend

# Copy package.json and package-lock.json first for caching
COPY reat_project/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of React code
COPY reat_project/ ./

# Build React production files
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

# Copy Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project files
COPY . ./

# Copy built React frontend into Django static directory
COPY --from=frontend /app/frontend/build ./reat_project/build

# Run Django checks (optional)
RUN python -m django --version
RUN python manage.py check

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port (Railway or local)
EXPOSE 8000

# Start Django with Gunicorn
CMD ["gunicorn", "main_project.wsgi:application", "--bind", "0.0.0.0:8000"]
