---
title: Commands to run
author: Abraham
---

# 🚀 Feedback Management System - Setup Commands

## Backend Setup (Django)

### 1. Create virtual environment 

**For Windows and Mac**
   
```bash
python -m venv venv
```
   
### 2. Activate virtual environment 

**Windows** 

```cmd
venv\Scripts\activate
```

**Mac/Linux** 

```bash
source venv/bin/activate
```

### 3. Install requirements 

```bash
pip install -r requirements.txt
```

### 4. Navigate to Django project

```bash
cd feedback_mgmt
```

### 5. Run database migrations

```bash
python manage.py migrate
```

### 6. Create superuser (optional)

```bash
python manage.py createsuperuser
```

### 7. Run development server

```bash
python manage.py runserver
```

Backend will be available at: http://localhost:8000/

## Frontend Setup (React)

### 1. Navigate to frontend directory

```bash
cd frontend
```

### 2. Install npm dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Frontend will be available at: http://localhost:5173/

## Additional Commands

### Backend Commands

#### Run tests
```bash
python manage.py test
```

#### Create new migrations
```bash
python manage.py makemigrations
```

#### Collect static files (for production)
```bash
python manage.py collectstatic
```

#### Access Django shell
```bash
python manage.py shell
```

### Frontend Commands

#### Build for production
```bash
npm run build
```

#### Preview production build
```bash
npm run preview
```

#### Run linting
```bash
npm run lint
```

## Access Points

- **Admin Panel**: http://localhost:8000/admin/
- **Frontend Application**: http://localhost:5173/


## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port by running `python manage.py runserver 8001` or `npm run dev -- --port 5174`

2. **Module not found**: Ensure virtual environment is activated and requirements are installed

3. **Database errors**: Run `python manage.py migrate` to apply database migrations

### Reset Database (if needed)

```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## Development Workflow

1. **Start backend**: Activate venv → cd feedback_mgmt → python manage.py runserver
2. **Start frontend**: cd frontend → npm run dev
3. **Access application**: Open http://localhost:5173 in browser
---


