const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { handleCORsOptionsRequest } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const {
  errorsHandlingMiddleware,
} = require('./middlewares/errors');
const { rateLimiterMiddleware } = require('./middlewares/rate_limiter');

// Production vs development settings
require('dotenv').config();

const { DEV_DATABASE = 'moviesdb', DEV_PORT = 3000 } = require('./constants/devs');

const { NODE_ENV, PROD_DATABASE = 'moviesdb', PROD_PORT = 3000 } = process.env;
const DATABASE = NODE_ENV === 'production' ? PROD_DATABASE : DEV_DATABASE;
const PORT = NODE_ENV === 'production' ? PROD_PORT : DEV_PORT;

// App and DB
const app = express();
mongoose.connect(DATABASE)
  .catch((err) => {
    console.log({ message: `Ошибка подключения к базе данных: ${err} ` });
    throw Error(`Ошибка подключения к базе данных: ${err} `);
  });

// Requests loging
app.use(requestLogger);

// Safety first
app.use(rateLimiterMiddleware);
app.use(helmet());

// CORS OPTION request handling
app.use(handleCORsOptionsRequest);

// Request parsers
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

// Routing
app.use(require('./routes/index'));

// Error handling (logging, handle celebrate, send response)
app.use(errorLogger);
app.use(errorsHandlingMiddleware);

// APP runner
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} with ${DATABASE} database`);
});

// for testing
module.exports = app;
