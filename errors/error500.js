class Error500 extends Error {
  constructor(message) {
    super(message);
    this.name = 'Error500';
    this.statusCode = 500;
  }
}

module.exports = Error500;
