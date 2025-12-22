const asyncHandler = (requestHandler) => {
  return (...args) => {
    // args may be (req, res, next) when used as Express middleware
    // or (data) when used as a plain function. Identify `next` if present.
    const next = args[2];
    try {
      const result = requestHandler(...args);
      return Promise.resolve(result).catch((err) => {
        if (typeof next === "function") return next(err);
        // no next() available — rethrow so caller can handle
        return Promise.reject(err);
      });
    } catch (err) {
      if (typeof next === "function") return next(err);
      return Promise.reject(err);
    }
  };
};

export { asyncHandler };
