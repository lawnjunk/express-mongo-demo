'use strict';

const chalk = require('chalk');

const warn = chalk.bold.yellow;
const error = chalk.bold.red;
const success = chalk.bold.green;
const data = chalk.bold.cyan;

function createLogger(msgPrefix, consoleMethod){
  consoleMethod = consoleMethod || 'log';
  return function(){
    const args = Array.prototype.slice.call(arguments);
    args.unshift(msgPrefix);
    console[consoleMethod].apply(null, args);
  };
}



exports.warn    = createLogger(warn('Warning:'), 'error');
exports.error   = createLogger(error('Error:'), 'error');
exports.success = createLogger(success('Success:'));

exports.data = function(vname, value){
  console.log(data(`${vname}:`), value)
};
