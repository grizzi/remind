<img src="./docs/reMind_Logo_transparent.png" alt="logo" width="200"/>

An app to remind users about their online purchase and auto-renewing
subscriptions.

## How it works

1. A simple `react` webapp with JWT based authentication
2. A `django` backend to store data in a postgres database
3. A combination of `celery` workers and recurring schedule to perform
   asynchronous tasks like sending reminders and emails.
4. A `redis` server to allow communication between `celery` workers and `django`

## Run locally

- Install
  [`docker compose`](https://docs.docker.com/compose/install/standalone/)
- In the root of directory of this repository run:

  ```bash
  docker compose up
  ```

- Open the webapp in your browser at
  [http://localhost:5173/login](http://localhost:5173/login)

- Open the mail catcher in your browser at
  [http://localhost:8025](http://localhost:8025)

## Run tests

```bash
docker compose run --rm django python manage.py test
docker compose run --rm django python manage.py test --pattern="tests_*.py" # to run specific tests

```

## Create admin and log to admin panel

- Create a superuser in the `django` container:

  ```bash
  docker compose run django python manage.py createsuperuser
  ```

- Log in to the admin panel at
  [http://localhost:8000/admin](http://localhost:8000/admin)
