server{
    listen 3000;
    root /var/www/react/build;

    location / {
    
    }

    location /dashboard {
        try_files $uri $uri/dashboard /index.html;
    }

    location /farms {
        try_files $uri $uri/farms /index.html;
    }

    location /workflow {
        try_files $uri $uri/workflow /index.html;
    }

    location /farm {
        try_files $uri $uri/farm /index.html;
    }

    location /members {
        try_files $uri $uri/members /index.html;
    }

    location /profile {
        try_files $uri $uri/profile /index.html;
    }

    location /user-workflow-list {
        try_files $uri $uri/user-workflow-list /index.html;
    }

    location /signup {
        try_files $uri $uri/signup /index.html;
    }

    location /login {
        try_files $uri $uri/login /index.html;
    }

    location /logout {
        try_files $uri $uri/logout /index.html;
    }

}