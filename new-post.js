'use strict';
/* eslint-disable no-console */
const title = process.argv[2] || 'post title',
  fs = require('fs'),
  moment = require('moment');

const sanitizedTitle = title.replace(/ /g, '-').toLowerCase();
const formattedDate = moment().format('YYYY-MM-DD');

const content = fs.readFileSync('./new-post-template.md', 'UTF-8').replace('TITLE', title);

const newFilePath = `./_posts/${formattedDate}-${sanitizedTitle}.md`;
fs.writeFileSync(newFilePath, content);
console.log(newFilePath);




