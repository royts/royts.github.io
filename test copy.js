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
