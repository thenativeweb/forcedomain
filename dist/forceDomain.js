'use strict';

var redirect = require('./redirect');

var forceDomain = function forceDomain(options) {
  return function (req, res, next) {
    var protocol = req.headers['x-forwarded-proto'] || req.protocol;
    var newRoute = redirect(protocol, req.headers.host, req.url, options);

    if (!newRoute) {
      return next();
    }

    var statusCode = newRoute.type === 'temporary' ? 307 : 301;
    res.writeHead(statusCode, {
      Location: newRoute.url
    });
    res.end();
  };
};

module.exports = forceDomain;