// HTTP STATUS CODES
// Successful responses
exports.HTTP_OK = 200;
exports.HTTP_CREATED = 201;

// Client error responses
exports.HTTP_BAD_REQUEST = 400;
exports.HTTP_UNAUTHORIZED = 401;
exports.HTTP_NOT_FOUND = 404;
exports.HTTP_VALIDATION_FAILED = 422;

// Server error responses
exports.HTTP_INTERNAL_SERVER_ERROR = 500;

// JWT SECRET
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES_IN = "1h";
