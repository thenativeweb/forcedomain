'use strict';

var _ = require('underscore');

var rewrite = require('./rewrite');

var redirect = function (hostHeader, url, options) {
  options = _.defaults(options, {
    protocol: 'http',
    port: 80,
    type: 'temporary'
  });

  var hostHeaderParts = (hostHeader || '').split(':'),
      hostname = hostHeaderParts[0] || '',
      port = (hostHeaderParts[1] - 0) || 80;

  if (
    (hostname === 'localhost') ||
    (hostname === options.hostname && port === options.port)
  ) {
    return;
  }

  var route = options.protocol + '://' + hostname + ':' + port + url,
      rewrittenRoute = rewrite(route, options);

  return {
    type: options.type,
    url: rewrittenRoute
  };
};

module.exports = redirect;
