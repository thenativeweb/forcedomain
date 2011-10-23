var redirectTo = function(domain) {
  return function(req, res, next) {
    var hostHeader = req.headers['host'] || '';

    // Check whether we are on localhost or the correct domain. If so, proceed normally.
    if(hostHeader.indexOf('localhost') > -1 || hostHeader.indexOf(domain) > -1) {
      next();
      return;
    }

    // Otherwise, redirect to correct domain.
    res.redirect('http://' + domain, 301);
  };
};

module.exports.redirectTo = redirectTo;
