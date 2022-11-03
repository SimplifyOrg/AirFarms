#!/bin/sh

set -e

python3 manage.py collectstatic --noinput
python3 manage.py migrate
#service start /etc/systemd/system/airfarms-daphne.service

uwsgi --socket :9000 --workers 4 --master --enable-threads -b 65535 --module machhli.wsgi & daphne -b 0.0.0.0 -p 9001 machhli.asgi:application
