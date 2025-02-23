## Quickstart

### Install Postgresql DB

```
sudo apt update
sudo apt install postgresql
```

### Run Server
python manage.py runserver

### Make migrations
python manage.py makemigrations

### Apply migrations
python manage.py migrate

### Create superuser

```
python manage.py createsuperuser
# user: admin
# pwd: admin
```