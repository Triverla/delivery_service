const path = require('path');
const fs =require('fs');
const winston = require('winston');

const config = require('./global');

const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const errorLog = path.join(logDir, 'error.log');
const combinedLog = path.join(logDir, 'combined.log');
const exceptionsLog = path.join(logDir, 'exceptions.log');

exports.logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	transports: [
		new winston.transports.File({
			filename: errorLog,
			level: 'error'
		}),
		new winston.transports.File({
			filename: combinedLog
		})
	],
	exceptionHandlers: [
		new winston.transports.File({
			filename: exceptionsLog
		})
	]
});

if (config.env.NODE_ENV !== 'production') {
	this.logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
			),
			level: 'debug'
		})
	);
}
