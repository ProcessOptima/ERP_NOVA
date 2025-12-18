# ERP NOVA Backend

Django REST Framework backend with JWT authentication.

## Security Notice

This codebase has undergone a comprehensive security audit. All critical vulnerabilities have been fixed. See [SECURITY.md](../SECURITY.md) for details.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and set the following **required** variables:

```bash
# Generate a new secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Update .env with the generated key
SECRET_KEY=your-generated-secret-key-here

# Set your database credentials
DB_NAME=processoptima_db
DB_USER=processoptima_admin
DB_PASSWORD=your-secure-password-here
DB_HOST=localhost
DB_PORT=5432
```

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE processoptima_db;
CREATE USER processoptima_admin WITH PASSWORD 'your-secure-password-here';
ALTER ROLE processoptima_admin SET client_encoding TO 'utf8';
ALTER ROLE processoptima_admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE processoptima_admin SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE processoptima_db TO processoptima_admin;
\q
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication

- `POST /api/auth/login/` - Login (returns cookies)
- `POST /api/auth/logout/` - Logout (clears cookies)
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user info

### Users Management (Admin Only)

- `GET /api/users/` - List all users
- `POST /api/users/` - Create new user
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

## Authentication Flow

This API uses **HTTP-only cookies** for JWT tokens:

1. Login via `POST /api/auth/login/` with email and password
2. Receive `access` and `refresh` cookies (HTTP-only)
3. All subsequent requests automatically include cookies
4. Access token expires in 5 minutes
5. Use `POST /api/auth/refresh/` to get new access token
6. Refresh token expires in 30 days

## Security Features

### Rate Limiting

Default throttle rates:
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

Configure in `.env`:
```bash
THROTTLE_ANON_RATE=100/hour
THROTTLE_USER_RATE=1000/hour
```

### Cookie Security

In production (`ENV=prod`):
- Cookies use `__Host-` prefix
- `Secure` flag enabled (HTTPS only)
- `SameSite=Strict`
- `HttpOnly` always enabled

### CORS Configuration

Configure allowed origins in `.env`:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Logging

All security events are logged to `logs/django.log`:
- Failed login attempts
- Invalid token usage
- Unauthorized access attempts
- User modifications

## Production Deployment

### Environment Variables

Set these in production `.env`:

```bash
SECRET_KEY=<new-generated-key>
DEBUG=False
ENV=prod
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com
DB_PASSWORD=<secure-password>
```

### Security Checklist

Before deploying to production:

- [ ] Generate new SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Set ENV=prod
- [ ] Configure ALLOWED_HOSTS
- [ ] Enable HTTPS/SSL
- [ ] Set secure database password
- [ ] Configure firewall
- [ ] Set up log rotation
- [ ] Enable database backups
- [ ] Review rate limiting settings

### Collect Static Files

```bash
python manage.py collectstatic
```

### Run with Gunicorn

```bash
pip install gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

## Development

### Run Tests

```bash
python manage.py test
```

### Create Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

### Django Admin

Access Django admin at `http://localhost:8000/admin/`

## Troubleshooting

### "SECRET_KEY environment variable not set"

Make sure you created `.env` file and set `SECRET_KEY`:
```bash
cp .env.example .env
# Edit .env and add SECRET_KEY
```

### CORS errors

Check that `CORS_ALLOWED_ORIGINS` in `.env` includes your frontend URL:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Database connection errors

Verify your database credentials in `.env` and that PostgreSQL is running:
```bash
psql -U processoptima_admin -d processoptima_db
```

## License

Proprietary - Process Optima
