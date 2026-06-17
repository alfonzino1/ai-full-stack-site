FROM python:3.12-slim

# Системные зависимости для psycopg2 (если wheel не подхватится)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Зависимости отдельно — для кэширования слоёв
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Код приложения
COPY . .

EXPOSE 8000

# Exec-форма: каждый аргумент — отдельный элемент массива
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]