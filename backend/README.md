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

Install postgresql
```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

Allow passwordless permissions to user
1. Open your pg_hba.conf file. You can locate it by running:

```
sudo -u postgres psql -c "SHOW hba_file;"
```

Edit the file and change the method for 127.0.0.1/32 from md5 or scram-sha-256 to trust:

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             127.0.0.1/32            trust
```

Restart PostgreSQL to apply changes:

```
sudo systemctl restart postgresql
```

Create a database if not there yet

```
sudo -u postgres createdb remind
```

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