const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        format.json(),
        format.simple()
    ),
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        }),
        new transports.File({
            filename: "src/logs/info.log",
            level: "info",
        }),
        new transports.File({
            filename: "src/logs/error.log",
            level: "error",
        }),
    ],
});

module.exports = logger;
