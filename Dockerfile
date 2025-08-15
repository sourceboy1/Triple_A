FROM python:3.11-slim

# Install system dependencies and Node.js directly
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    build-essential \
    nodejs \
    npm \
 && npm install -g npm@latest \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy project
COPY . /app/

# Install React dependencies and build React
RUN npm install --prefix reat_project && \
    npm run build --prefix reat_project

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Collect Django static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run Django with Gunicorn
CMD ["sh", "-c", "gunicorn main_project.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]


