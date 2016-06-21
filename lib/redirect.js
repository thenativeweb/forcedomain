'use strict';

var _ = require('lodash');

var rewrite = require('./rewrite');

var redirect = function (protocol, hostHeader, url, options) {
  var hostHeaderParts,
      hostname,
      port,
      rewrittenRoute,
      route,
      targetProtocol;

  options = _.defaults(options, {
    protocol: undefined,
    type: 'permanent'
  });

  hostHeaderParts = (hostHeader || '').split(':');
  hostname = hostHeaderParts[0] || '';
  port = (hostHeaderParts[1] - 0) || undefined;
  targetProtocol = options.protocol ? options.protocol : protocol;

  if (
    (hostname === 'localhost') ||
    (hostname === options.hostname && port === options.port && protocol === targetProtocol)
  ) {
    return null;
  }

  route = targetProtocol + '://' + hostname + (port ? ':' + port : '') + url;
  rewrittenRoute = rewrite(route, options);

  /* eslint-disable consistent-return */
  return {
    type: options.type,
    url: rewrittenRoute
  };
  /* eslint-enable consistent-return */
};

module.exports = redirect;
