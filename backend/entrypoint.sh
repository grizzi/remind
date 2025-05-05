#!/bin/bash

# Wait for PostgreSQL to start only if postgres host does not end with .supabase.com
if [[ ${POSTGRES_HOST} != *.supabase.com ]]; then
  echo "Waiting for postgres database ${POSTGRES_HOST}:${POSTGRES_PORT} to come alive..."
  while ! nc -z ${POSTGRES_HOST} ${POSTGRES_PORT}; do
    sleep 1.0
    echo "Waiting for postgres database ${POSTGRES_HOST}:${POSTGRES_PORT} to come alive..."
  done
else
  echo "Postgres host is a remote managed Postgre instance, skipping wait."
fi

echo "PostgreSQL started"

echo "Making migrations..."
python manage.py makemigrations api
python manage.py migrate


exec "$@"
