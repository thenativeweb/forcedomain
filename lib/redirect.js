var url = require('url');

var redirect = function(domain, configuration) {
  configuration = configuration || {};
  configuration.type = configuration.type || 'permanent';
  configuration.cutPath = configuration.cutPath || true;

  return function(req, res, next) {
    var hostHeader = req.headers.host || '',
        options,
        statusCode;

    if(hostHeader.indexOf('localhost') === 0 || hostHeader.indexOf(domain) === 0) {
      next();
      return;
    }

    if(!configuration.cutPath) {
      options = url.parse(req.url);
      options.host = domain;
      options = url.format(options);
    } else {
      options = url.format({
        protocol: 'http:',
        host: domain
      });
    }

    statusCode = configuration.type === 'permanent' ? 301 : 307;
    res.writeHead(statusCode, {
      'Location': options
    });
    res.end();
  };
};

module.exports.redirect = redirect;
