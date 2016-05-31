'use strict';

const chalk = require('chalk');

const warn = chalk.bold.yellow;
const error = chalk.bold.red;
const success = chalk.bold.green;
const data = chalk.bold.magenta;

function createLogger(msgPrefix, consoleMethod){
  consoleMethod = consoleMethod || 'log';
  return function(){
    const args = Array.prototype.slice.call(arguments);
    args.unshift(msgPrefix);
    console[consoleMethod].apply(null, args);
  };
}

console.appWarn    = createLogger(warn('Warning:'), 'error');
console.appError   = createLogger(error('Error:'), 'error');
console.appSuccess = createLogger(success('Success:'));
console.appData = function(vname, value){
  console.log(data(`${vname}:`), value);
};
