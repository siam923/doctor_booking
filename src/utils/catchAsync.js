// This prevents the need to wrap each asynchronous operation in a try-catch block.
exports.catchAsync = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };