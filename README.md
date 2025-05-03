<img src="./docs/reMind_Logo_transparent.png" alt="logo" width="200"/>

An app to remind users about their online purchase and auto-renewing
subscriptions.

# How it works

1. A simple `react` webapp with JWT based authentication
2. A `django` backend to store data in a postgres database
3. A combination of `celery` workers and recurring schedule to perform
   asynchronous tasks like sending reminders and emails.
4. A `redis` server to allow communication between `celery` workers and `django`

# Running the app

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

# Contributing

We use pre-commit hooks to ensure code quality. Install all the required
dependencies for the hook to run.

### Pre-commit Hooks

- `pre-commit` is a framework for managing and maintaining multi-language
  pre-commit hooks.

- `checkov` is run as a precommit hook to check for security issues in the
  infrastructure. Integration instructions are available at the
  [official page](https://www.checkov.io/2.Basics/Installing%20Checkov.html)

- `infracost-breakdown` is run as a precommit hook to check for cost changes in
  the infrastructure. Integration instructions are available at the
  [official page](https://www.infracost.io/docs/#2-get-api-key)

```bash
pipx install pre-commit checkov

# required once
curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh
infracost auth login # required once or to reauthenticate
infracost configure set currency CHF
```

# Deployment workflow

Install aws cli

Make sure you have the following in your `~/.aws/config` file:

```
[profile app-admin]
region = eu-central-1
```

Export the aws credentials set in the `~/.aws/credentials` file:

```bash

[app-admin]
aws_access_key_id = xxx
aws_secret_access_key = xxx
```

Export the aws profile:

```bash
export AWS_PROFILE=app-admin
```

Sync webapp

```bash
cd frontend npm install npm run build aws s3 cp dist/
s3://remind-webapp/ --recursive
```
