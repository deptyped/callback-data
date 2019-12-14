class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

class CallbackDataOverflowError extends ExtendableError {}
class CallbackDataParseError extends ExtendableError {}

module.exports = {
  CallbackDataOverflowError,
  CallbackDataParseError,
};
