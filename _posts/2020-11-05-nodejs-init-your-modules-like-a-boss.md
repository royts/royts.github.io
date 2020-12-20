---
layout: post
title: Init you node modules like a boss
fbcomments: yes
tags: [nodejs]
---
*tl;dr*
- Init you resources when the node module is loaded
- In every place you need the resource, require/import it and await 

# The Problem
You have a module that hold a resource that need to be initialized.  
This can be opening a DB connection, loading configuration or loading some cache.

# The Old Way
I'll use a DB connection initialization in a web server as an example.  
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

// dog.js
const db = require('./db');
async function getDogs() {
  const conn = await db.getConn();
  return conn.query('SELECT * FROM dogs');
}

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
- You don't need to decide (and might make mistakes) about module dependencies. It is the result of modules requiring each other.
- Your server module does not have to know all the dependencies between modules. Just those which are critical for it's operation.
- In the real world you probably going to use the DB module in other places like CRONs or manual scripts. Instead of managing dependencies again you just require the module you need (DB) and everything else just happen.
- Modules are initiated as soon as possible and you know that no time is wasted on waiting for other dependency your resource might not need.
