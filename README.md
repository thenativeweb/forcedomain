# node-force-domain

node-force-domain is a middleware for Connect and Epxpress that redirects any request to a default domain.

If you have any questions or feedback, feel free to contact me using [@goloroden](https://twitter.com/goloroden) on Twitter.

## Installation

    $ npm install node-force-domain

## Quick start

The first thing you need to do is to integrate node-force-domain into your application. For that add a reference to the `node-force-domain` module.

```javascript
var forceDomain = require('node-force-domain');
```

If you now want to redirect your requests to a specific host, include the middleware and configure it accordingly:

```javascript
app.use(forceDomain({
  hostname: 'www.example.com'
}));
```

Additionally, you can also specify a port and a target protocol:

```javascript
app.use(forceDomain({
  hostname: 'www.example.com',
  port: 4000,
  protocol: 'https'
}));
```

By default, node-force-domain creates a `temporary` request. If you want to use a `permanent` redirect instead, specify it as redirection type:

```javascript
app.use(forceDomain({
  hostname: 'www.example.com',
  type: 'permanent'
}));
```

Please note that `localhost` is always being excluded from redirection. Hence you can continue developing locally as you are used to.

### Using a reverse-proxy

If you are running your web application behind a reverse proxy such as Nginx, you have to forward the originally requested host:

    server {
      // ...

      location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $http_host;
      }
    }

## Running the tests

node-force-domain has been developed using TDD. To run the tests, go to the folder where you have installed node-force-domain to and run `npm test`. You need to have [mocha](https://github.com/visionmedia/mocha) installed.

    $ npm test

Additionally, this module can be built using [Grunt](http://gruntjs.com/). Besides running the tests, Grunt also analyses the code using [JSHint](http://www.jshint.com/). To run Grunt, go to the folder where you have installed node-force-domain and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt

## License

The MIT License (MIT)
Copyright (c) 2013 Golo Roden.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
