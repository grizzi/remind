## Tutorials

* [Django + React](https://www.youtube.com/watch?v=c-QsfbznSXI&t=1s)
* [React + Typescript](https://react.dev/learn/typescript)
* [Another one](https://dev.to/koladev/django-rest-authentication-cmh)

## Install

```
cd backend
python3 -m pip install poetry
poetry install
```


## Authentication


### JWT Tokens

TODO: see this https://www.youtube.com/watch?v=vLTJ_03Dq4M&t=0s

1. The user authenticate with username and password
2. The server if recognizes the user, returns a access token (expires soon) and the refresh token
3. The frontend stores them in the local storage and uses the access token for future request
4. when the access token expires, the refresh token is used by the frontend to get a new access token. 
5. If also the refresh token expires than the user has to login again
6. We have two tokens because if the access token had to be leaked, then this would last for short

# Backend

## Django

#### Concepts
* ORM: Object Relational Mapper -> map python objects to database
* allows to not perform direct SQL queries
* manages migration

CRUD set of operations on data: 
* Create
* Remove
* Update
* Delete

### Create

```bash
django-admin startproject backend
cd backend
django-admin startapp api
```bash

### Migrate the database

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Run the server

```bash
cd backend
python mange.py runserver
```


# Frontend

### Create

```bash
# in the root, above backend
npm create vite@latest frontend -- --template react-ts
```


TODO:
  - get a max of subscriptions per user allowed with a "free" plan