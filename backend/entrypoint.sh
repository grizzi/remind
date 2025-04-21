#!/bin/bash

while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 1.0
  echo "Waiting for postgres database ${POSTGRES_HOST}:${POSTGRES_PORT} to come alive..."
done

echo "PostgreSQL started"

echo "Making migrations..."
python manage.py makemigrations api
python manage.py migrate


exec "$@"
