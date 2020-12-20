// // server.js
// const express = require('express'),
//               db = require('./db'),
//     dog = require('./dog');

// const app = express();
// app.get('/dog', dog.getDogs);

// db.init().then(() => {
//     app.listen(8080)
// });

// // dog.js
// const db = require('./db');
// function getDogs() {
//     return db.query('SELECT * FROM dogs');
// }

// // db.js
// let connection;
// function init() {
//     // init the connection
// }
// function query(q, args) {
//     connection.query(q, args);
// }

// // // server.js
// // const express = require('express'),
// //     config = require('./config'),
// //     credentials = require('./credentials'),
// //     db = require('./db'),
// //     dog = require('./dog');

// // const app = express();
// // app.get('/dog', dog.getDogs);

// // config.init()
// //     .then(() => credentials.init()
// //         .then(() => db.init()
// //             .then(() => { app.listen(8080) })));

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
