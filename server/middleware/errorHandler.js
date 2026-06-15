module.exports = (err, req, res, next) => {
  console.error("Unhandled Application Error:", err);

  const status = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred on the server.";

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
  });
};
