export class AppError extends Error {
    statusCode: number;
    status: number;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = statusCode >= 400 && statusCode < 500 ? 0 : 0;
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  