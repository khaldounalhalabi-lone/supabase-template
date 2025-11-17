import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { trans } from "../../modules/localization/Helpers.ts";
import { rest } from "../../modules/response/ApiResponse.ts";
import HttpStatus from "../../modules/response/enums/HttpStatus.ts";
import { isDevelopment } from "../helpers/environment.ts";
import { AppError } from "./AppError.ts";

export class ErrorHandler {
  public handle(error: Error, _context: Context): Response {
    const statusCode = this.getStatusCode(error);
    const message = this.getErrorMessage(error, _context);

    if (statusCode >= 500) {
      console.error("Server error:", error);
    }

    const response = rest()
      .data(null)
      .message(message)
      .code(this.normalizeStatusCode(statusCode));

    if (isDevelopment()) {
      response.error(this.getDebugInfo(error));
    } else {
      response.error("UNKNOWN ERROR");
    }

    return response.send();
  }

  private getDebugInfo(error: Error): Record<string, unknown> {
    const debugInfo: Record<string, unknown> = {
      name: error.name,
      message: error.message,
    };

    if (error.stack) {
      debugInfo.stack = error.stack;
    }

    if (error instanceof HTTPException) {
      debugInfo.type = "HTTPException";
      debugInfo.status = error.status;
      if (error.cause) {
        debugInfo.cause = error.cause;
      }
    } else if (error instanceof AppError) {
      debugInfo.type = "AppError";
      debugInfo.statusCode = error.statusCode;
      if (error.code) {
        debugInfo.code = error.code;
      }
    } else {
      debugInfo.type = "Error";
    }

    return debugInfo;
  }

  private getStatusCode(error: Error): number {
    if (error instanceof HTTPException) {
      return error.status;
    }
    if (error instanceof AppError) {
      return error.statusCode;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private normalizeStatusCode(statusCode: number): number {
    if (statusCode < 200) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    if (statusCode > 599) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return statusCode;
  }

  private getErrorMessage(error: Error, _context: Context): string {
    if (error instanceof HTTPException) {
      return error.message || this.getLocalizedMessage(error.status);
    }
    if (error instanceof AppError) {
      return error.message || this.getLocalizedMessage(error.statusCode);
    }
    return this.getLocalizedMessage(HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private getLocalizedMessage(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return trans("error_validation");
      case HttpStatus.UNAUTHORIZED:
        return trans("error_unauthorized");
      case HttpStatus.FORBIDDEN:
        return trans("error_forbidden");
      case HttpStatus.NOT_FOUND:
        return trans("error_not_found");
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return trans("error_internal_server");
      default:
        return trans("error_unknown");
    }
  }
}
