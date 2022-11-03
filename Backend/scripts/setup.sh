#!/bin/sh
set -e

sudo apt -y install python3.10
export PYTHONUNBUFFERED=1

export DJANGO_DEBUG=False
sudo mkdir /app
cd /app
# ALLOW COPY in /app: sudo chmod 777 -R /app
sudo chmod 777 -R /app
# COPY requirments.txt from windows machine to ubuntu: pscp -i C:\Users\ABS#\Downloads\machhlibackend1.ppk D:\workdir\FisheryApp\Backend\requirements.txt ubuntu@ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:/app/requirements.txt
# EXPOSE 8000: WIP
# INSTALL pip: sudo apt -y install python3-pip
sudo apt -y install python3-pip

sudo pip install -r requirements.txt
sudo apt-get update
sudo apt-get install -y systemd binutils libproj-dev gdal-bin daphne
sudo apt install -y python3-dev libpq-dev
sudo apt-get install -y redis-server
pip3 install psycopg2

# ALLOW COPY in /etc/systemd/system:  sudo chmod 777 -R /etc/systemd/system
sudo chmod 777 -R /etc/systemd/system
# COPY machhli-daphne.service to ubuntu: pscp -i C:\Users\ABS#\Downloads\machhlibackend1.ppk D:\workdir\FisheryApp\Backend\daphne\machhli-daphne.service ubuntu@ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:/etc/systemd/system

cd ..
sudo mkdir /scripts
cd /scripts
sudo chmod 777 -R /scripts

# COPY scripts directory to ubuntu: pscp -r -i C:\Users\ABS#\Downloads\machhlibackend1.ppk D:\workdir\FisheryApp\Backend\scripts\ ubuntu@ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:/scripts/
# COPY django app to /app: pscp -r -i C:\Users\ABS#\Downloads\machhlibackend1.ppk D:\workdir\FisheryApp\Backend\ ubuntu@ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:/app/

# GIVE executable permission to run.sh
chmod +x /scripts/run.sh
export PATH="/scripts:/py/bin:$PATH"
cd ..
cd /app
mkdir /app/static
run.sh

