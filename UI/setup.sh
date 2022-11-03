#!/bin/sh
set -e

sudo mkdir /etc/nginx/
sudo chmod 777 -R /etc/nginx/
# COPY default conf: pscp -i C:\Users\ABS#\Downloads\machhliui.ppk D:\workdir\FisheryApp\webUI\ui\default.conf.tpl ubuntu@ec2-13-235-51-10.ap-south-1.compute.amazonaws.com:/etc/nginx/default.conf.tpl
sudo mkdir /app/
sudo chmod 777 -R /app/
# COPY run.sh: pscp -i C:\Users\ABS#\Downloads\machhliui1.ppk D:\workdir\FisheryApp\webUI\ui\run.sh ubuntu@ec2-13-235-51-10.ap-south-1.compute.amazonaws.com:/app/run.sh
sudo mkdir -p /var/www/react
sudo chmod 777 -R /var/www/react
# COPY build: pscp -r -i C:\Users\ABS#\Downloads\machhliui1.ppk D:\workdir\FisheryApp\webUI\ui\build ubuntu@ec2-13-235-51-10.ap-south-1.compute.amazonaws.com:/var/www/react/
sudo mkdir /etc/nginx/conf.d/
sudo apt install -y nginx
sudo touch /etc/nginx/conf.d/default.conf

sudo chmod +x /app/run.sh

export LISTEN_PORT=3000
export APP_HOST=127.0.0.1
export APP_PORT=3000