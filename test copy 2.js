// dog.js
const db = require('./db');
function getDogs() {
  return db.query('SELECT * FROM dogs');
}
