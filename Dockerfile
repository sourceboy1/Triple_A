# --------------------------
# Stage 1: Build React Frontend
# --------------------------
FROM node:20 AS frontend

WORKDIR /app/frontend

COPY reat_project/package*.json ./
RUN npm install
COPY reat_project/ ./
RUN npm run build

# --------------------------
# Stage 2: Django Backend
# --------------------------
FROM python:3.11-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./

# Copy React build BEFORE collectstatic
COPY --from=frontend /app/frontend/build ./reat_project/build

# Dummy env vars for collectstatic only — no migrate here
ENV SECRET_KEY=dummy-secret-key-for-build
ENV DEBUG=False
ENV DATABASE_URL=sqlite:///db.sqlite3
ENV CLOUDINARY_URL=cloudinary://000000000000000:dummy@dummy

# ✅ collectstatic only — no migrate at build time
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# ✅ migrate runs here at container startup against the REAL database
CMD sh -c "python manage.py migrate --noinput && \
    python manage.py shell -c '\
from django.contrib.auth import get_user_model; \
import os; \
User = get_user_model(); \
email = os.environ[\"DJANGO_SUPERUSER_EMAIL\"]; \
password = os.environ[\"DJANGO_SUPERUSER_PASSWORD\"]; \
username = os.environ.get(\"DJANGO_SUPERUSER_USERNAME\", \"admin\"); \
User.objects.filter(email=email).exists() or User.objects.create_superuser(username=username, email=email, password=password)' && \
    gunicorn main_project.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 2 \
    --threads 2 \
    --timeout 180 \
    --max-requests 300 \
    --max-requests-jitter 30"