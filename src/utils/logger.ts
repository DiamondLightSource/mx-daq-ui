enum LogLevel {
  LOG = "log",
  INFO = "info",
  DEBUG = "debug",
  WARN = "warn",
  ERROR = "error",
}

const getTimestamp = (): string => {
  return new Date().toLocaleString();
};

const log = (level: LogLevel, message: string, ...data: unknown[]): void => {
  const timestamp = getTimestamp();
  const prefix = `[${level.toUpperCase()}]`;
  console[level](`${prefix} ${timestamp}: ${message}`, ...data);
};

export const logger = {
  log: (message: string, ...data: unknown[]) =>
    log(LogLevel.LOG, message, ...data),
  info: (message: string, ...data: unknown[]) =>
    log(LogLevel.INFO, message, ...data),
  debug: (message: string, ...data: unknown[]) =>
    log(LogLevel.DEBUG, message, ...data),
  warn: (message: string, ...data: unknown[]) =>
    log(LogLevel.WARN, message, ...data),
  error: (message: string, ...data: unknown[]) =>
    log(LogLevel.ERROR, message, ...data),
};
