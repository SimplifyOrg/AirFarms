#!/bin/sh

set -e

export LISTEN_PORT=80
export APP_HOST=localhost
export APP_PORT=9000
export APP_PORT=9001

envsubst '$${LISTEN_PORT},$${APP_HOST},$${APP_PORT},$${APP_PORT}' < /etc/nginx/default.conf.tpl > /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'