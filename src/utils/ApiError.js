class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack=""
  ) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.success = false
    this.data=null
    this.message=message

  }
}

export {ApiError}