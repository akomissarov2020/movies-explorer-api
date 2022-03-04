const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares/auth');
const { login, createUser } = require('./controllers/user');
const Error404 = require('./errors/error404');
const Error500 = require('./errors/error500');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const { DATABASE } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

const allowedCors = [
  'http://mesto2002.nomoredomains.work/',
  'https://mesto2002.nomoredomains.work/',
  'http://mesto2002.nomoredomains.work/api/',
  'https://mesto2002.nomoredomains.work/api/',
  'localhost:3000',
];

mongoose.connect('mongodb://localhost:27017/' + bitfilmsdb')
  .catch((err) => {
    console.log({ message: `Ошибка подключения к базе данных: ${err} ` });
    throw Error(`Ошибка подключения к базе данных: ${err} `);
  });

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (allowedCors.includes(origin)) {
    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      return res.end();
    }
    res.header('Access-Control-Allow-Origin', origin);
  }
  return next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/api/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(authMiddleware);
app.use('/', require('./routes/user'));
app.use('/', require('./routes/movie'));

app.use('*', (req, res, next) => next(
  new Error404('Ресурс не найден. Проверьте URL и метод запроса'),
));

app.use(errorLogger);

// Celebrate errors
app.use(errors());

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  // console.log(statusCode);
  // console.log(message);
  // console.log(name);
  res.status(statusCode).send(
    { message: statusCode === 500 ? Error500('На сервере произошла ошибка') : message },
  );
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
