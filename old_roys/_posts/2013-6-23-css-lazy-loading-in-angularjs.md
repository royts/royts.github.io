---
layout: post
title: CSS Lazy Loading in AngularJS
fbcomments: yes
---
![_config.yml]({{ site.baseurl }}/images/angular.png){: .hide-on-mobile}

## The simple way
A classical Angular app starts with a HTML file. In the head tag you'll put all the  link tags for your templates style, and under the  body tag you'll stick the ng-app directive.

## The Problem
1. Every module should be an atomic unit:
Each module (controller,template and a CSS) should function as an independent unit. We should be able to take a module out and add new one without major changes to the whole app.

In a classical angular app, with each module template taking in out out you should maintain the link tags in the Head. With many templates this is no a pretty sight...

The right way to too it would be adding the link tag inside the module template file. The problem is that link tag [is not allowed inside the body tag](http://www.w3.org/TR/html4/present/styles.html), and although it will work, [it ain't going to be pretty](http://stackoverflow.com/questions/1642212/whats-the-difference-if-i-put-css-file-inside-head-or-body).

2. A template should be able to ask 3rd party style:
In addition to it's own style file, a template may use a 3rd party UI lib (like [AngularUI](http://angular-ui.github.io/), [AngularStrap](http://mgcrea.github.io/angular-strap/) or a custom directive with a CSS file).

Maintaining this dependencies in the head tag by hand is not a big fun and error prone.
In addition, multiple modules can use the same 3rd party lib, and we should make sure to load it's CSS file only once because [browsers are not smart to prevent it](http://stackoverflow.com/questions/515400/does-the-same-stylesheet-get-loaded-multiple-times-on-different-pages).

3. Sometimes we have no access to the `head` tag:
In our case, this application is wrapped with many JSP templates and pages, and it should be self contained. Touching the wrapping JSPs is not an option.

## The first solution
I created an Angular service that can load a CSS file by appending a `link` tag to the `head` tag and I've using it in the controllers:
```javascript
angular.module('cssLoadingService', []).factory("CssLoadingService", function () {
  return {
    loadCss: function (url) {
      if (document.createStyleSheet) {
        document.createStyleSheet(url); //IE
      } else {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    }
  };
});


function SomeController(CssLoadingService) {
  CssLoadingService.loadCss("style.css");
}
```

But this is not a good solution.
First, it don't prevent loading the 3rd party CSS files over multiple times.
Second' it is ugly! the CSS let the browser know how it should render the template. It's place is in the template and not in the controller!

## A better solution
I've created a new directive and used it in the templates. 
I added a peace of logic to verify we are loading each style file only once:
```javascript
app.directive('lazyStyle',
  function () {
    var loadedStyles = {};
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {

        var stylePath = attrs.href;

        if (stylePath in loadedStyles) {
          return;
        }

        if (document.createStyleSheet) {
          document.createStyleSheet(stylePath); //IE
        } else {
          var link = document.createElement("link");
          link.type = "text/css";
          link.rel = "stylesheet";
          link.href = stylePath;
          document.getElementsByTagName("head")[0].appendChild(link);
        }

        loadedStyles[stylePath] = true;

      }
    };
  });

// In the template:
<lazy-style href="style.css"/>
```

## Calculated paths
In my app, we are using a server mechanism to calculate the path to all of our resources, so the href value should be calculated:

```html
<lazy-style href="{{basicResourcePath}}style/myModule/style.css"/>
```

The problem is that the directive code is executed before the `basicResourcePath` is being evaluated which leads to a wrong CSS path.
The solution I've found is to use the ``$observe` on the attributes to the directive:
```javascript
app.directive('lazyStyle',
  function () {
    var loadedStyles = {};
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {

        attrs.$observe('href', function (value) {

          var stylePath = value;

          if (stylePath in loadedStyles) {
            return;
          }

          if (document.createStyleSheet) {
            document.createStyleSheet(stylePath); //IE
          } else {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = stylePath;
            document.getElementsByTagName("head")[0].appendChild(link);
          }

          loadedStyles[stylePath] = true;

        });
      }
    };
  });
```
<small><a href="https://icraftsman.blogspot.co.il/2013/06/css-lazy-loading-in-angularjs-app.html">link to the original post with comments</a></small>
