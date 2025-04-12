"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf, errors } = winston_1.format;
const errorFormat = printf((prop) => {
    const { level, message, timestamp } = prop;
    return `${timestamp} [${level.toUpperCase()}] : ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(errors({ stack: true }), // Capture stack trace if available
    errorFormat),
    transports: [
        new winston_1.transports.File({ filename: './log/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: './log/combined.log' }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.simple(),
    }));
}
exports.default = logger;
