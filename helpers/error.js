'use strict';

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  if (err instanceof ErrorHandler) {
    var { statusCode, message } = err;
  } else {
    var statusCode = 500;
    var message = err.message;
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
}