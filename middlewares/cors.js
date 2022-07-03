const { allowedCORS } = require('../cors_settings');

module.exports.handleCORsOptionsRequest = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';

  if (true || allowedCORS.includes(origin)) {
    if (method === 'OPTIONS') {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
      return res.end();
    }
    res.header('Access-Control-Allow-Origin', origin);
  }
  return next();
};
