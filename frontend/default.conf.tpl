server{
    listen ${LISTEN_PORT};

    location / {
        root /var/www/react;
    }

    
}