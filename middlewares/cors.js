const { allowedCORS } = require('../cors_settings');

module.exports.handleCORsOptionsRequest = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (true || allowedCORS.includes(origin)) {
    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Origin', origin);
      return res.end();
    }
    res.header('Access-Control-Allow-Origin', origin);
  }
  return next();
};
