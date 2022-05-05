#!/bin/sh

set -e

python manage.py collectstatic --noinput
python manage.py migrate
#service start /etc/systemd/system/airfarms-daphne.service

uwsgi --socket :9000 --workers 4 --master --enable-threads -b 65535 --module airfarms.wsgi & daphne -p 9001 airfarms.asgi:application
