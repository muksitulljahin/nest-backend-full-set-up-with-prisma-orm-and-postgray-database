// Interface for structured error details
export interface StructuredErrorDetails {
  data?: Record<string, any>;
  meta?: Record<string, any>;
}

export class ErrorHandler extends Error {
  public statusCode: number;
  public data?: Record<string, any>;
  public meta?: Record<string, any>;

  constructor(
    statusCode: number,
    message: string,
    details: StructuredErrorDetails = {},
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = details.data;
    this.meta = details.meta;

    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}
