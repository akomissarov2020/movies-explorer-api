const winston = require('winston');
const expressWinston = require('express-winston');

const { NODE_ENV } = process.env;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = NODE_ENV || 'development';
  const isProduction = env === 'production';
  return isProduction ? 'warn' : 'debug';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
  }),
];

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => {
      if (info.meta.error.name === 'Error500') {
        return `${info.timestamp} ${info.level}: ${info.message} ${info.meta.error.name} ${JSON.stringify(info)}`;
      }
      return `${info.timestamp} ${info.level}: ${info.message} ${info.meta.error.name} ${info.meta.error.message}`;
    },
  ),
);

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports.requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'logs/request.log' }),
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  meta: true,
  msg: 'HTTP  {{req.method}} {{res.responseTime}}ms {{req.url}} {} ',
  expressFormat: true,
  colorize: true,
});

module.exports.errorLogger = expressWinston.errorLogger(Logger);
