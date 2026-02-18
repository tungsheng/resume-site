export interface LogContext {
  [key: string]: unknown;
}

function write(level: "INFO" | "WARN" | "ERROR", message: string, context?: LogContext): void {
  const prefix = `[resume-site] [${level}]`;
  if (context && Object.keys(context).length > 0) {
    const payload = `${prefix} ${message}`;
    if (level === "ERROR") {
      console.error(payload, context);
    } else if (level === "WARN") {
      console.warn(payload, context);
    } else {
      console.log(payload, context);
    }
    return;
  }

  if (level === "ERROR") {
    console.error(`${prefix} ${message}`);
  } else if (level === "WARN") {
    console.warn(`${prefix} ${message}`);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

export const logger = {
  info(message: string, context?: LogContext): void {
    write("INFO", message, context);
  },
  warn(message: string, context?: LogContext): void {
    write("WARN", message, context);
  },
  error(message: string, context?: LogContext): void {
    write("ERROR", message, context);
  },
};
