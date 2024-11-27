/**
 * Error handling class
 */
class AppError extends Error {
  /**
   * Creates a new AppError instance
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    // Remove the need for Error.captureStackTrace
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

module.exports = AppError;