## Quickstart

### Install and Operate Postgresql DB

##### Run Database

Install postgresql

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

```
sudo -u postgres psql

```

Allow passwordless permissions to user

1. Open your pg_hba.conf file. You can locate it by running:

```
sudo -u postgres psql -c "SHOW hba_file;"
```

Edit the file and change the method for 127.0.0.1/32 from md5 or scram-sha-256
to trust:

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

### Instal Redis

From
https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/

```
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update
sudo apt-get install redis
```

Run the redis server

```
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### Run Mailhog to test sending emails

```
docker run --rm -p 1025:1025 -p 8025:8025 --name mailhog mailhog/mailhog
```

### Run celery workers and beat

From the backend folder

```
celery -A backend worker --beat --scheduler django --loglevel=info
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
