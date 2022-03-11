const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/auth');
const { handleCORsOptionsRequest } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const { errorsHandlingMiddleware } = require('./middlewares/errors');
const { rateLimiterMiddleware } = require('./middlewares/rate_limiter');
const Error404 = require('./errors/error404');
const { ERROR_404_URL_TEXT } = require('./constants/error_texts');

// Production vs development settings
const { DEV_DATABASE, DEV_PORT = 3000 } = require('./constants/devs');

const { NODE_ENV, PROD_DATABASE, PROD_PORT = 3000 } = process.env;
const DATABASE = NODE_ENV === 'production' ? PROD_DATABASE : DEV_DATABASE;
const PORT = NODE_ENV === 'production' ? PROD_PORT : DEV_PORT;

// App and DB
const app = express();
mongoose.connect(DATABASE)
  .catch((err) => {
    throw Error(err);
  });

// Safety first
app.use(helmet());
app.use(rateLimiterMiddleware);

// CORS OPTION request handling
app.use(handleCORsOptionsRequest);

// Request parsers
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

// Loging
app.use(requestLogger);

// Routing
app.use(require('./routes/auth'));

app.use(authMiddleware);
app.use(require('./routes/index'));

app.use('*', (req, res, next) => next(
  new Error404(ERROR_404_URL_TEXT),
));

// Error handling (logging, handle celebrate, send response)
app.use(errorLogger);
app.use(errorsHandlingMiddleware);

// APP runner
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} with ${DATABASE} database`);
});

// for testing
module.exports = app;
