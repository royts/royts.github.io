---
layout: post
title: Init you node modules like a boss
fbcomments: yes
tags: [nodejs]
---
*tl;dr* . 
*- Init your resources when the node module is loaded* . 
*- In every place you need the resource, require/import it and await*

# The Problem
You have a module that use a resource which need to be initialized.  
This can be a DB connection that need to be opened, a configuration that need to be loaded, or a cache that need to be warmed up. 

# The Old Way
Let's use a DB connection initialization in a web server as an example.  
  
I see this pattern a-lot:

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

I even saw cases where the server module managed all the dependencies:
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
# The Better Way
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

And if you don't want your server to get requests before the DB connection initialization, you can wait on it:
```javascript
// server.js
const express = require('express'),
  db = require('./db'),
  dog = require('./dog');

const app = express();
app.get('/dog', dog.getDogs);

db.getConn().then(() => app.listen(8080));
```

# Why Is It a Better Way?
- Module dependencies happens automatically as the result of modules requiring each other. No need to define and maintain it manually.
- The server module does not have to know all the dependencies between modules. Just those which are critical for it's operation.
- In the real world we probably are going to use the DB module in other places like CRONs or manual scripts. Instead of managing dependencies again we can just require the module we need (DB) and everything else just works.
- Modules are initiated as soon as possible, and we know that no time is wasted on waiting for other dependency our resource might not need.
