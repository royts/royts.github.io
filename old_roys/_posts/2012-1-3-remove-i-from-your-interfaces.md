---
layout: post
title: Remove the 'i' from your interfaces
fbcomments: yes
---


![_config.yml]({{ site.baseurl }}/images/letter-i.jpg){: .hide-on-mobile}

Let's say I'm creating two classes - A and B, when A is using B.

Because I don't want A to be coupled to B, I'am injecting an interface that B implements.

Until today, even if I had only one implementation for this interface, I created an interface called IB, implement it in B and inject it to A.

The idea of creating an interface just to allow me to change the implementation of B in the future always felt like violation of [YAGNI](http://c2.com/xp/YouArentGonnaNeedIt.html).

Well, yesterday I reached the "Interfaces and implementations" section in [Clean Code](http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) of [Uncle Bob](http://www.objectmentor.com/omTeam/martin_r.html).

He recommends  to prevent from adding an I to interface name because the client (who uses the implementation) shouldn't know that he's getting an interface:
> I prefer to leave interfaces unadorned. The preceding I, so common in today’s legacy wads, is a distraction at best and too much information at worst. I don’t want my users knowing that I’m handing them an interface.... So if I must encode either the interface or the implementation, I choose the implementation.

Then I  thought about the fact that there are many classes in Java libraries that don't starts with an 'I' although they are an interfaces: [CharSequence](http://docs.oracle.com/javase/6/docs/api/java/lang/CharSequence.html) , [Connection](http://docs.oracle.com/javase/6/docs/api/java/sql/Connection.html) etc.

So, I have decided to stop adding the 'I' prefix to my interfaces. This way I can create a single implementation and extract an interface in the future if I'll need it.

