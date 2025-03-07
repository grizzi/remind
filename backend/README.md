## Quickstart

### Install Postgresql DB

```
sudo apt update
sudo apt install postgresql
```
### Access DB

```
sudo -u postgres psql
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