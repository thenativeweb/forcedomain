'use strict';

const url = require('url');

const _ = require('lodash');

const rewrite = function (route, options) {
  options = _.defaults({
    protocol: undefined,
    hostname: undefined
  }, options);

  const parsedRoute = url.parse(route);

  parsedRoute.host = undefined;

  if (options.protocol) {
    parsedRoute.protocol = options.protocol;
  }
  if (options.hostname) {
    parsedRoute.hostname = options.hostname;
  }
  if (options.port) {
    parsedRoute.port = options.port;
  }

  return url.format(parsedRoute);
};

module.exports = rewrite;
