---
layout: post
title: The damned 'init' method
fbcomments: yes
---
You probably saw this pattern many times before:

```java
class MyClass {
 public init () {
 ...
 }
 
 public execute () {
 }
}
```
where the 'init' method prepares the object and do things like: loading configuration, initializing internal objects, etc. and the method 'execute' do the actual work.

Why is it bad?

Your client (who is using your class) can easily use this class in a way that will broke it.
What will happen is he'll create the instance and run the 'execute' method with calling the 'init' method before?

Like every piece of code we write, this class has a public API.
A good API should direct the user to use it properly, in other words - do what can be done to prevent misuse.
The critical information about the right way of doing things inside this class should be kept there as well.

So what is the right way?
Well, all the actions that are related to creating the object and the things he need to do it's job - should be be in the constructor.
All the actions that are related to the 'execute' method, should be in it.

Finding the right way
I can think of situations where the pattern above is a must-have.Still, in most cases it is bad to use it and you can find other solutions that will make your API more solid.
For example, in C++ you can't call a ctor from other ctor so instead of creating many ctors with different signatures you will be tempted to create a set on 'init' methods.
One solution to this problem is creating a set on private 'init' methods and call it from to ctros.
(thanks to @danprinz for this example)
