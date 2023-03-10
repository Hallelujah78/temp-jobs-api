const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, please try again later",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  if (err.name === "CastError") {
    customError.msg = `No item found with ID: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((value) => {
        return `${value.message}. `;
      })
      .join("")
      .trimEnd();
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )}`;
    customError.statusCode = 400;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
