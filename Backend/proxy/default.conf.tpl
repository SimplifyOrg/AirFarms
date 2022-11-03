# the upstream component nginx needs to connect to
upstream django {
    # server unix:///path/to/your/mysite/mysite.sock; # for a file socket
    server 127.0.0.1:9000; # for a web port socket (we'll use this first)
}

upstream socket {
    ip_hash;
    server 127.0.0.1:9001 fail_timeout=0;
}

server{
    listen 8000;

    location /static {
        proxy_set_header Host 'servestaticfilebucket.s3.amazonaws.com'; 
        proxy_set_header Authorization ''; 
        proxy_hide_header x-amz-id-2; 
        proxy_hide_header x-amz-request-id; 
        proxy_hide_header Set-Cookie; 
        proxy_ignore_headers "Set-Cookie"; 
        proxy_intercept_errors on; 
        proxy_pass https://servestaticfilebucket.s3.amazonaws.com/; # Edit your Amazon S3 Bucket name 
        expires 1y; 
        log_not_found off;
    }

    location / {
        #uwsgi_pass                ${APP_HOST}:${APP_PORT};
        uwsgi_pass                django;
        include                   /etc/nginx/uwsgi_params;
        client_max_body_size      10M;
    }

    location /ws/
    {
        proxy_pass http://127.0.0.1:9001;

        proxy_http_version 1.1;
        proxy_set_header Upgrade 1;
        proxy_set_header Connection "upgrade";

        proxy_redirect off;
        proxy_set_header Host ${APP_HOST};
        proxy_set_header X-Forwarded-Host ${APP_HOST};
    }
}