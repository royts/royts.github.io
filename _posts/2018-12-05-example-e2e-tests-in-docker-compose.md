---
layout: post
title: '[example] E2E Tests by Docker-Compose'
fbcomments: yes
tags: [docker, docker-compose]
---
### The App
A web aplication that offer date CRUD by http requests.
The application is using MySql to store the data and post to ElasticSearch for easy search.

### The Tests
We want to run a real end-to-end tests.
We'll load the service with a local Mysql and ES and send some http requests.
Then we'lll check the data in the DB and ES to verify the changes has been made.

### Show Me Some Code!

```yml
version: '3'
services:

  claims:
    container_name: claims_service
    build: ./
    image: ${FULL_CONTAINER_NAME}
    environment:
      - FORTER_ENV=develop
      - NODE_ENV=dev
      - ES_SESSIONS=elasticsearch
      - ES_SESSIONS_DISABLE_SSL=true
      - DB_HOST=mysql
      - DB_DATABASE=db
      - DB_USER=root
      - DB_PASS=abc123
      - ES_SESSIONS_INDEX_NAME=sessions
      - ES_HOST=elasticsearch
    ports:
      - 8080:8080
    depends_on:
      - mysql
      - elasticsearch
    command: ./wait-for elasticsearch:9200 --timeout=90 -- ./wait-for mysql:3306 --timeout=90 -- npm start
    links:
      - mysql
      - elasticsearch
    logging:
      driver: json-file

  claims_e2etests:
    container_name: claims_e2etests
    build: ./
    image: ${FULL_CONTAINER_NAME}
    environment:
      - FORTER_ENV=develop
      - NODE_ENV=dev
      - ES_SESSIONS=elasticsearch
      - ES_SESSIONS_DISABLE_SSL=true
      - DB_HOST=mysql
      - DB_DATABASE=db
      - DB_USER=root
      - DB_PASS=abc123
      - ES_SESSIONS_INDEX_NAME=sessions
      - ES_HOST=elasticsearch
      - CLAIMS_HOST=http://claims
      - MOCHA_FILE_PATH=/app/test-reports/
    depends_on:
      - claims
      - elasticsearch
    command: ./wait-for claims:8080 --timeout=60 -- npm run ci-test
    links:
      - elasticsearch
      - claims
    volumes:
      - ${TESTS_OUTPUT_PATH}:/app/test-reports/
    logging:
      driver: json-file

  mysql:
    container_name: mysql
    image: mysql:5.6
    environment:
      - MYSQL_ROOT_PASSWORD=abc123
      - MYSQL_DATABASE=db
      - MYSQL_USER=user
      - MYSQL_PASSWORD=pass
    volumes:
      - ./test/e2e/config/init-db/:/docker-entrypoint-initdb.d
    logging:
      driver: json-file

  elasticsearch:
    container_name: elasticsearch
    image: elasticsearch:5.6
    ports:
      - 9200:9200
    # https://docs.docker.com/compose/compose-file/#ulimits
    # https://www.ibm.com/support/knowledgecenter/en/ssw_aix_71/com.ibm.aix.cmds5/ulimit.htm
    # https://docs.docker.com/compose/compose-file/#sysctls
    ulimits:
      nofile: 65536
      #threads:
        #soft: 4096
        #hard: 4096
    logging:
      driver: json-file
```
