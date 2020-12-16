---
layout: post
title: Can you solve this puzzle?
fbcomments: yes
---
Update - the position is not open anymore.
you can still answer the puzzle though...

***

Outbrain is looking for experienced, talented, enthusiastic web developers.
You can read about the position here.
Interested?
Solve this quick puzzle and contact me: roy@royts.com

```javascript
// We need to create a chat client. 
// The messages pulling policy to should be:

// 1. Get the latest messages from  the server
// 2. Wait 2 sec.
// 3. Back to no. 1 again

// Q: what is wrong with the following solution? 
//    What would be the right way to do that?

setInterval(function () {
 
    $.getJSON( "http://chat-server.com/10/message", function( data ) {
          updateChatWindow(data.messages);
      });
 
}, 2000);
```
