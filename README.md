# node-force-domain

node-force-domain is a middleware for the Connect and / or Express.js framework that allows you to have multiple domains, but forces them to redirect to a default one.

If you have any questions or feedback, feel free to contact me on [Twitter @goloroden](https://twitter.com/goloroden).

## Installation

    $ npm install node-force-domain

## Quick Start

Using node-force-domain is easy. All you need to do is to register it within Express.js as middleware. Therefore, simply add the following line into your app.js file before all other calls to app.use(...):

```javascript
app.use(require('node-force-domain').redirect('www.example.com'));
```

By default, a 301 (permanent) redirect is used, and any path / query string data is cleared. If you want to change this behavior, feel free to provide a configuration object:

```javascript
app.use(require('node-force-domain').redirect('www.example.com', {
  type: 'permanent', // 'temporary' === 307
  cutPath: true
}));
```

If you are running your Node.js based web application behind a reverse proxy such as Nginx, you have to forward the originally requested host:

    server {
      // ...

      location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $http_host;
      }
    }


Please note that localhost is always being excluded from the redirection rule. Hence you can continue developing locally as you are used to.

That's it :-)!

## Copyright

(c) Copyright 2011-2012 [Golo Roden](http://www.goloroden.de), contact using webmaster@goloroden.de
