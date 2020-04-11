/*=============================================================================
TD API Service HTTP Response Errors
=============================================================================*/

// HTTP 204 No Content
// status 204 received in the service will be sent as status 200 in the response to the controller
// the response data will be empty

// HTTP 207 Partial Content sent on response
// status 207 received in the service will be sent as status 200 in the response to the controller

// HTTP 400 Invalid Request 
module.exports = class InvalidRequestError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'InvalidRequestError';
    }

};

// HTTP 401 Unauthorized Token
module.exports = class UnauthorizedTokenError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'UnauthorizedTokenError';
    }

};

// HTTP 403 Forbidden
module.exports = class ForbiddenError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'ForbiddenError';
    }

};

// HTTP 404 Not Found
exports = class NotFoundError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'NotFoundError';
    }
};

// HTTP 500 Unexpected Server Error
module.exports = class ServerError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'ServerError';
    }
};    

// HTTP 503 Temporary Server Error
// indicating there is a temporary problem TD server responding
// the service function will send status 503 in the repsonse to the controller to indicate to retry
module.exports = class TemporaryError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'TemporaryError';
    }
};