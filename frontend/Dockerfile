FROM nginxinc/nginx-unprivileged:1-alpine
#FROM node:16.15-alpine

COPY ./default.conf.tpl /etc/nginx/default.conf.tpl
COPY ./run.sh /run.sh

ENV LISTEN_PORT=3000
ENV APP_HOST=frontend
ENV APP_PORT=3000

USER root

# RUN mkdir -p /vol/static && \
    # chmod 755 /vol/static && \
#RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/v3.16/main/ nodejs && \
RUN mkdir -p /var/www/react && \
    chown --recursive nginx:nginx /var/www/react && \
    touch /etc/nginx/conf.d/default.conf && \
    chown nginx:nginx /etc/nginx/conf.d/default.conf && \
    chmod +x /run.sh

COPY ./ui/build /var/www/react/

# VOLUME /vol/static

USER nginx

CMD ["/run.sh"]
