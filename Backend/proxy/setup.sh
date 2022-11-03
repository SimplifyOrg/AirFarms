#!/bin/sh
set -e

sudo mkdir /etc/nginx/
sudo chmod 777 -R /etc/nginx/
# COPY nginx conf: pscp -i C:\Users\ABS#\Downloads\machhlibackend1.ppk D:\workdir\FisheryApp\Backend\proxy\default.conf.tpl ubuntu@ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:/etc/nginx/default.conf.tpl
# COPY uwsgi_params: pscp -i C:\Users\ABS#\Downloads\machhlibackend1.ppk D:\workdir\FisheryApp\Backend\proxy\uwsgi_params ubuntu@ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:/etc/nginx/uwsgi_params
sudo mkdir /app/proxy
sudo chmod 777 -R /app/proxy
# COPY run.sh: pscp -i C:\Users\ABS#\Downloads\machhlibackend1.ppk D:\workdir\FisheryApp\Backend\proxy\run.sh ubuntu@ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:/run.sh
sudo chmod +x /app/proxy/run.sh

export LISTEN_PORT=8000
export APP_HOST=backend
export APP_PORT=9000
export APP_PORT=9001

 sudo mkdir /etc/nginx/conf.d/
 sudo touch /etc/nginx/conf.d/default.conf

 sudo apt install -y nginx

