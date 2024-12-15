FROM python:3.11

RUN apt-get update && apt-get install -y postgresql-client

COPY ./requirements.txt /tmp/
WORKDIR /tmp
RUN pip install -r requirements.txt

WORKDIR /skapp/classapp

CMD [ "python", "manage.py", "runserver" ]
