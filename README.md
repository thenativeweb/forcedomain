# forcedomain

forcedomain is a middleware for Connect and Express that redirects any request to a default domain, e.g. to redirect to either the www or the non-www version of a domain.

## Installation

```bash
$ npm install forcedomain
```

## Quick start

The first thing you need to do is to integrate forcedomain into your application. For that add a reference to the `forcedomain` module.

```javascript
const forceDomain = require('forcedomain');
```

If you now want to redirect your requests to a specific host, include the middleware and configure it accordingly.

```javascript
app.use(forceDomain({
  hostname: 'www.example.com'
}));
```

Additionally, you can also specify a port and a target protocol.

```javascript
app.use(forceDomain({
  hostname: 'www.example.com',
  port: 4000,
  protocol: 'https'
}));
```

By default, forcedomain redirects using `permanent` request. This is generally considered best practice with respect to SEO, as it tells search engines that there is a single long-term canonical address for a ressource.

If you want to use a `temporary` redirect instead, specify it as redirection type.

```javascript
app.use(forceDomain({
  hostname: 'www.example.com',
  type: 'temporary'
}));
```

You can use `excludeRule` to disable redirect based on a regular expression.

```javascript
app.use(forceDomain({
  hostname: 'www.example.com',
  excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.herokuapp\.com/i
}));
```

*Please note that `localhost` and local IPs (`192.168.x.x`) are always being excluded from redirection. Hence you can continue developing locally as you are used to.*

### Using a reverse-proxy

If you are running your web application behind a reverse proxy such as Nginx, you have to forward the originally requested host.

```
server {
  // ...

  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $http_host;
  }
}
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```bash
$ bot
```

## License

The MIT License (MIT)
Copyright (c) 2013-2016 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
