---
layout: post
title: Init you're node modules like a boss
fbcomments: yes
tags: [nodejs]
---

# The Problem
We have resources that need to be initialized before we can use them.  
Some examples: DB connection that needs to be opened, a configuration that needs to be loaded, or a cache that needs to be warmed up. 

*tl;dr*  
*- Init your resources when the node module is loaded*  
*- In every place you need the resource, require/import it and await*  
# The Old Way
In this example, we need to initialize a DB connection when we load up our web server.
  
A common pattern is:

```javascript
// server.js
const express = require('express'),
  db = require('./db'),
  dog = require('./dog');

const app = express();
app.get('/dog', dog.getDogs);

db.init().then(() => {
  app.listen(8080);
});
```
```javascript
// dog.js
const db = require('./db');
function getDogs() {
  return db.getConn().query('SELECT * FROM dogs');
}
module.exports = { getDogs };
```
```javascript
// db.js
let connection;
function init() {
  // init the connection
}
module.exports = { getConn: () => connection }
```

There are even implementations where the server module combines all the dependencies:
```javascript
// server.js
const express = require('express'),
  config = require('./config'),
  credentials = require('./credentials'),
  db = require('./db'),
  dog = require('./dog');

const app = express();
app.get('/dog', dog.getDogs);

config.init().then(() =>
  credentials.init().then(() =>
    db.init().then(() => {
      app.listen(8080);
    }),
  ),
);
```
# A Better Way
```javascript
// server.js
const express = require('express'),
  dog = require('./dog');

const app = express();
app.get('/dog', dog.getDogs);
app.listen(8080);
```
```javascript
// dog.js
const db = require('./db');
async function getDogs() {
  const conn = await db.getConn();
  return conn.query('SELECT * FROM dogs');
}
```
```javascript
// db.js
async function initConn() {
  //init connection
}
const connPromise = initConn();
module.exports = { getConn: () => connPromise };
```

And if we don't the server to get requests before the DB connection is initialized, we can wait on it:
```javascript
// server.js
const express = require('express'),
  db = require('./db'),
  dog = require('./dog');

const app = express();
app.get('/dog', dog.getDogs);

db.getConn().then(() => app.listen(8080));
```

# Why Is It Better?
- Module dependencies happen automatically as the result of modules requiring each other.  
No need to define and maintain the dependencies yourself, and you won't have to worry about the wrong order.
- The server module doe's not know all the dependencies between modules. Just those which are critical for its operation.
- In the real world we probably going to use the DB module in other places like CRONs or manual scripts. Instead of listing the dependencies in another place (and maintain this code when things are changing), we can just require the DB module end everything else just works.
- Modules are initiated as soon as possible. We know that no time is wasted in loading resources.
