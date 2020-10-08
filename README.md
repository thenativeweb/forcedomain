# forcedomain

forcedomain is a middleware for Connect and Express that redirects any request to a default domain, e.g. to redirect to either the www or the non-www version of a domain.

## Status

| Category         | Status                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Version          | [![npm](https://img.shields.io/npm/v/forcedomain)](https://www.npmjs.com/package/forcedomain)                                                      |
| Dependencies     | ![David](https://img.shields.io/david/thenativeweb/forcedomain)                                                                                   |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/forcedomain)                                                                               |
| Build            | ![GitHub Actions](https://github.com/thenativeweb/forcedomain/workflows/Release/badge.svg?branch=master) |
| License          | ![GitHub](https://img.shields.io/github/license/thenativeweb/forcedomain)                                                                         |

## Installation

```shell
$ npm install forcedomain
```

## Quick start

The first thing you need to do is to integrate forcedomain into your application. For that add a reference to the `forcedomain` module:

```javascript
const { forceDomain } = require('forcedomain');
```

If you use TypeScript, use the following code instead:

```typescript
import { forcedomain } from 'forcedomain';
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

By default, forcedomain redirects using `permanent` request. This is generally considered best practice with respect to SEO, as it tells search engines that there is a single long-term canonical address for a ressource.

If you want to use a `temporary` redirect instead, specify it as redirection type:

```javascript
app.use(forceDomain({
  hostname: 'www.example.com',
  type: 'temporary'
}));
```

You can use `excludeRule` to disable redirect based on a regular expression:

```javascript
app.use(forceDomain({
  hostname: 'www.example.com',
  excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.herokuapp\.com/i
}));
```

_Please note that `localhost` and local IPs (`127.0.0.1`, `192.168.x.x`) are always being excluded from redirection. Hence you can continue developing locally as you are used to._

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

```shell
$ npx roboter
```
