# Blog CMS

Full-stack приложение для блога/CMS с **React + FastAPI + PostgreSQL + Redis + Nginx**.

## Стек

| Компонент  | Технология        |
|------------|-------------------|
| Frontend   | React 18 + Vite + TypeScript |
| Backend    | Python + FastAPI + SQLAlchemy |
| Database   | PostgreSQL         |
| Cache      | Redis              |
| Proxy      | Nginx              |
| Auth       | JWT (python-jose)  |

## Структура проекта

```
blog-cms/
├── backend/          # FastAPI приложение
│   ├── app/
│   │   ├── main.py           # Точка входа, CORS, роутеры
│   │   ├── database.py       # SQLAlchemy engine + session
│   │   ├── redis_client.py   # Подключение к Redis
│   │   ├── dependencies.py  # Зависимости (get_db, get_current_user)
│   │   ├── models/           # SQLAlchemy модели (User, Post, Comment)
│   │   ├── schemas/           # Pydantic схемы
│   │   ├── routers/           # API роутеры (auth, posts, comments)
│   │   └── services/          # Бизнес-логика (auth, cache, post)
│   ├── alembic/               # Миграции БД
│   ├── requirements.txt
│   └── alembic.ini
├── frontend/         # React SPA
│   └── src/
│       ├── components/        # UI-компоненты
│       ├── pages/             # Страницы
│       ├── services/          # API-клиент (axios)
│       ├── hooks/             # useAuth
│       └── types/             # TypeScript типы
├── nginx/            # Nginx конфиг
│   └── default.conf          # Reverse proxy конфигурация
├── .env.example      # Пример переменных окружения
├── .gitignore
└── README.md
```

## Запуск

### 1. Переменные окружения

```bash
cp .env.example .env
# Отредактируйте .env — укажите свои DATABASE_URL, REDIS_URL, SECRET_KEY
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Linux/macOS
# venv\Scripts\activate       # Windows

pip install -r requirements.txt

# Создание таблиц (через Alembic или автоматически при старте)
alembic upgrade head

# Запуск
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API документация (Swagger): http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение будет доступно на http://localhost:3000 (с проксированием `/api` на backend:8000).

### 4. Nginx

Скопируйте `nginx/default.conf` в конфигурацию Nginx. Конфиг предполагает, что backend и frontend доступны по имени хостов `backend:8000` и `frontend:3000` (для Docker) или замените upstream на нужные адреса.

## API Endpoints

| Method | Endpoint                    | Описание              | Auth |
|--------|-----------------------------|-----------------------|------|
| POST   | `/api/auth/register`        | Регистрация           | No   |
| POST   | `/api/auth/login`           | Вход, возвращает JWT  | No   |
| GET    | `/api/auth/me`              | Текущий пользователь  | Yes  |
| GET    | `/api/posts`                | Список статей (page, page_size) | No |
| GET    | `/api/posts/{id}`           | Детали статьи         | No   |
| POST   | `/api/posts`                | Создать статью        | Yes  |
| PUT    | `/api/posts/{id}`           | Редактировать статью  | Yes  |
| DELETE | `/api/posts/{id}`           | Удалить статью        | Yes  |
| GET    | `/api/posts/{id}/comments`  | Комментарии статьи    | No   |
| POST   | `/api/posts/{id}/comments`  | Добавить комментарий  | Yes  |
| DELETE | `/api/comments/{id}`        | Удалить комментарий   | Yes  |

## Redis кэширование

- Списки статей (по страницам) — TTL 5 минут
- Детальные страницы статей — TTL 5 минут
- Кэш инвалидируется при создании/обновлении/удалении статьи

## Миграции БД (Alembic)

```bash
cd backend
alembic revision --autogenerate -m "описание изменения"
alembic upgrade head
alembic downgrade -1
```
