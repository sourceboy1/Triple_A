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

# ✅ Copy React build BEFORE collectstatic so the files actually exist
COPY --from=frontend /app/frontend/build ./reat_project/build

# ✅ Dummy values so collectstatic doesn't crash without real env vars
ENV SECRET_KEY=dummy-secret-key-for-build
ENV DEBUG=False
ENV DATABASE_URL=sqlite:///db.sqlite3
# ✅ Dummy Cloudinary URL so django-cloudinary-storage doesn't crash during collectstatic
ENV CLOUDINARY_URL=cloudinary://000000000000000:dummy@dummy

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD sh -c "python manage.py migrate --noinput && gunicorn main_project.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --threads 2 --timeout 180 --max-requests 300 --max-requests-jitter 30"