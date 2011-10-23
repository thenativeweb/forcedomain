# node-force-domain

node-force-domain is a middleware for the Express.js framework that allows you to have multiple domains, but forces them to redirect (301) to a default one.

## Installation

    $ npm install node-force-domain

## Quick Start

Using node-force-domain is easy. All you need to do is to register it within Express.js as middleware.

Therefore, simply add the following line into your app.js file before all other calls to app.use(...):

```javascript
app.use(require('node-force-domain').redirectTo('www.example.com'));
```

Please note that localhost is being excluded from the redirection rule. Hence you can continue developing locally as you are used to.

That's it :-)!

## Copyright

(c) Copyright 2011 [Golo Roden](http://www.goloroden.de), contact using webmaster@goloroden.de
