function ErrorWithStatusCode(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
  
function successResponse(isSuccess, payload) {
    return {
        success: isSuccess,
        payload: payload
    };
}

module.exports.ErrorWithStatusCode = ErrorWithStatusCode;
module.exports.successResponse = successResponse;
