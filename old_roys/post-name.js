'use strict';
const raw = process.argv[2];
console.log(raw.replace(/ /g, '-').toLowerCase());
