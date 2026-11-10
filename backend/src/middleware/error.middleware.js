// create and throw a custom error class to handle application-specific errors
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Handle Mongoose validation errors and return a formatted error message
const handleValidationError = (error) => {
    const messages = Object.values(error.errors).map(
        (err) => err.message
    );

    return new AppError(messages.join('. '), 400);
};

// Global error handling middleware to catch and respond to errors in a consistent format
const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
        error = handleValidationError(error);
    }
    console.error('ERROR:', error);
    console.error('STACK:', error.stack);

    res.status(error.statusCode).json({
        status: error.status,
        message: error.isOperational
            ? error.message
            : 'Something went wrong!'
    });
};

export { AppError, globalErrorHandler, handleValidationError };