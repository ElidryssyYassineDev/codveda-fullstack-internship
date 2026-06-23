const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose schema validation failures (e.g. negative price, missing field)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Malformed ObjectId reaching a query directly (defensive, beyond our middleware)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;