/**
 * Created by timout on 9/13/16.
 */
"use strict";
const winston = require('winston');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
// Create the log directory if it does not exist
if ( ! fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.File)({
            filename: `${logDir}/nwsonlan.log`,
            level: "debug",
            timestamp: tsFormat,
            maxsize: 1000000,
            maxFiles: 3,
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});

logger.exitOnError = true;//TODO:??

module.exports=logger;