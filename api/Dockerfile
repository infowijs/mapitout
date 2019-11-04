FROM amsterdam/python

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY src /app/
COPY requirements.txt /app/

RUN pip install -r requirements.txt

CMD uwsgi -s /tmp/mapitout.sock --manage-script-name --mount /=proxy_server:app
