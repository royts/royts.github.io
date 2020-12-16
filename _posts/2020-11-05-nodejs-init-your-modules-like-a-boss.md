---
layout: post
title: Init you node modules like a boss
fbcomments: yes
tags: [nodejs]
---
Some of your application modules need to be initialize before they can be used. DB client is a classic example - you need to init the connection before you can run some queries.  

# The old way
I see this pattern in many places:

```Javascript
// server.js
const express = require('express'),
    db = require('./db'),
    dog = require('./dog');

const app = express();
app.get('/dog', dog.getDogs);

db.init().then(() => {
    app.listen(8080)
});
```
```Javascript
// dog.js
const db = require('./db');
function getDogs() {
    return db.query('SELECT * FROM dogs');
}
```
```Javascript
// db.js
let connection;
function init() {
    // init the connection
}

function query(q, args) {
    connection.query(q, args);
}
```
# Worst
I even saw cases where the root module managed all the dependencies between the child modules:
```Javascript

```
# A Better Way
# Why
# What If
