---
layout: post
title: Your API should cover all the possible ways to use it
fbcomments: yes
---

A good API guide your clients toward the right way to use it.
Anyway, you should think about all the ways clients can use it, and handle these cases.
Here are some examples:

## Example 1 - config calss (Java):
```java
class Config {
 public init () {
    // load config from file
 }
 
 public get (String key) {
    // return config value
 }
}
```
You want the users to call `init()` and then `get()`, but what if they call `get()` without `init()`?
Sure, the best to way would be to force the client into the correct way to use it, and [load the config from file in ctor]({{ site.baseurl }}/the-damned-init-method/).
But let's say you don't want to use the ctor. Example: you are using a dependency injection framework that create the class instance for you and you want you client to be able to control when the havy loading happens.

You got two options here:
1. Throw with a proper message if `init` is not called
2. Init the configuration data is not initialized before.

Anyway, don't leave this case unhandled.

## Example 2 - convert module (Javascript):
You got a module that gets an object and convert some of its properties format.

```javascript
function convert (value){
  //do some conversion and return
}
module.exports = data => {
  data.someProp = convert(data.someOtherProp);
}
```
With this API, your client needs to know that you are changing the parameter you got (which is debatable by itself).
A better way would be to return the changed object, so event clients that use the returned value will get a good result:

A side note:
I had a similar case, where I had many calculated fields, and I wanted to force a specific pattern so users can't misuse the code.
Javascript does not offer something a way to prevent function from change its parameter, but I found a nice solution:
I added a `.jshint` file to the calculated fields folder - where all the calc. fields modules are, with one rule:
```json
{
  "rules":{
    "no-param-reassign": ["error", { "props": true }]
  }
}
```
Basically it says that you can't modify the function parameter.
Eslint [supports](https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy) hierarchy in configuration, so all the other rules from the project `.eslintrc` file apply in this folder in addition to this specific rule.

