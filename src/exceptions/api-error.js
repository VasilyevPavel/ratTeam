function createApiError(status, message, errors = []) {
  return {
    status,
    message,
    errors,
  };
}

function unauthorizedError() {
  return createApiError(401, 'Пользователь не авторизован');
}

function badRequestError(message, errors = []) {
  return createApiError(400, message, errors);
}

module.exports = {
  createApiError,
  unauthorizedError,
  badRequestError,
};
