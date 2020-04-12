/*=============================================================================
TD API Service HTTP Response Errors
=============================================================================*/

// HTTP 201 Created
// status 201 received in the service will be sent as status 201 in the response to the controller
// the response data will be empty

// HTTP 204 No Content
// status 204 received in the service will be sent as status 200 in the response to the controller
// the response data will be empty

// HTTP 207 Partial Content sent on response
// status 207 received in the service will be sent as status 200 in the response to the controller

// HTTP 400 Bad Request 
class BadRequestError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'BadRequestError';
    }
}

// HTTP 401 Unauthorized
class UnauthorizedError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'UnauthorizedError';
    }
}

// HTTP 403 Forbidden
class ForbiddenError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'ForbiddenError';
    }
}

// HTTP 404 Not Found
class NotFoundError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'NotFoundError';
    }
}

// HTTP 500 Internal Server Error
class InternalServerError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'InternalServerError';
    }
}

// HTTP 503 Service Unavailable Error
// indicating there is a temporary problem TD server responding
// the service function will send status 503 in the repsonse to the controller to indicate to retry again later
class ServiceUnavailableError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'ServiceUnavailableError';
    }
}

module.exports = { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, ServiceUnavailableError };