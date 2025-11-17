import HttpStatus from "../../modules/response/enums/HttpStatus.ts";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation error", code?: string) {
    super(HttpStatus.BAD_REQUEST, message, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", code?: string) {
    super(HttpStatus.UNAUTHORIZED, message, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", code?: string) {
    super(HttpStatus.FORBIDDEN, message, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not found", code?: string) {
    super(HttpStatus.NOT_FOUND, message, code);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error", code?: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, code);
  }
}

