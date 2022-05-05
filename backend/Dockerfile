FROM python:3.10.4
ENV PYTHONUNBUFFERED 1

ENV DJANGO_DEBUG False
RUN mkdir /app
WORKDIR /app
COPY requirements.txt /app/

EXPOSE 8000

RUN pip install -r requirements.txt
RUN apt-get update &&\
    apt-get install -y systemd binutils libproj-dev gdal-bin daphne && \
    adduser --disabled-password --no-create-home backenduser
COPY ./scripts /scripts
COPY ./daphne /etc/systemd/system
COPY . /app/
# RUN mkdir -p /vol/web/static && \
#     mkdir -p /vol/web/media && \
#RUN chown -R backenduser:backenduser /vol && \
    # chown -R backenduser:backenduser /vol/web/static && \
    # chmod -R 755 /vol/web/static && \
    # chmod -R 755 /vol/web/media && \
   # $chmod -R +x /scripts


ENV PATH="/scripts:/py/bin:$PATH"

USER backenduser

# VOLUME [ "/vol/web/static" ]
# VOLUME [ "/vol/web/media" ]

CMD ["run.sh"]