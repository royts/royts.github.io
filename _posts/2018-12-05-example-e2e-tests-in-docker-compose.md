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
# docs: https://docs.docker.com/compose/compose-file/
version: '3'
services:
  my_app:
    container_name: my_app
    build: ./
    image: ${FULL_CONTAINER_NAME}
    environment:
      - ENV=test
      - ES_HOST=elasticsearch
      - DB_HOST=mysql
      - DB_NAME=db
      - DB_USER=root
      - DB_PASS=abc123
    ports:
      - 8080:8080
    depends_on:
      - mysql
      - elasticsearch
    # source: https://github.com/eficode/wait-for
    # `depends_on` is not enough.
    # We use wait-for to start the service only after Mysql and ES init is done
    # consider moving to docker's healthcheck
    command: ./wait-for elasticsearch:9200 --timeout=90 -- ./wait-for mysql:3306 --timeout=90 -- make start
    links:
      - mysql
      - elasticsearch
    logging:
      driver: json-file

  my_app_e2etests:
    container_name: my_app_e2etests
    build: ./
    image: ${FULL_CONTAINER_NAME}
    environment:
      - ENV=develop
      # We make some changes in ES and Mysql in tests init and read from it in the assertion phase
      - ES_HOST=elasticsearch
      - DB_HOST=mysql
      - DB_NAME=db
      - DB_USER=root
      - DB_PASS=abc123
    depends_on:
      - my_app
      - elasticsearch
      - mysql
    command: ./wait-for claims:8080 --timeout=60 -- npm run ci-test
    links:
      - elasticsearch
      - mysql
      - my_app
    volumes:
      # We save the test reports in JunitXML format so the CI can show them in a nice way
      - ${TESTS_OUTPUT_PATH}:/app/test-output/
    logging:
      driver: json-file

  mysql:
    container_name: mysql
    image: mysql:5.6
    environment:
      - MYSQL_ROOT_PASSWORD=abc123
      - MYSQL_DATABASE=db
    volumes:
    # The content of /e2e_tests/init_db/:
    # 1.create-tables.sql
    # 2.insert-data.sql
    #
    # These sql statements files will run automatically after DB init is done
      - ./e2e_tests/init_db/:/docker-entrypoint-initdb.d
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

### How to run
```make
# MakeFile
start:
	# Start the service
e2e-test:
	# Run the actual tests using Mocha, Pytest or anything else
docker-e2e-test:
	docker-compose rm -f mysql
	docker-compose rm -f  elasticsearch
  # consider moving to  --exit-code-from=my_app_e2etests
	docker-compose up -t 300 --abort-on-container-exit
```
