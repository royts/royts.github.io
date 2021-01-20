---
layout: post
title: Polyfill Promise.allSettled
fbcomments: yes
tags: [javascript]
---
```javascript
function settled(p) {
  return new Promise(res => {
    p.then(value => res({status:'fulfilled', value}))
     .catch(err => res({status:'rejected', reason: err.message || err}));
  });
}
function allSettled(promises) {
  return Promise.all(promises.map(p => settled(p)));
}
module.exports = { allSettled };
```