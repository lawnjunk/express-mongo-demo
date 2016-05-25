'use strict';

const debug = require('debug');

const AppErr = module.exports = function(message, status, response){
  Error.call(this);
  this.message = message;
  this.status = status;
  this.response = response;
};

AppErr.prototype = Object.create(AppErr.prototype);

AppErr.isAppErr = function(err){
  return err instanceof AppErr;
};

AppErr.error400 = function(message){
  return new AppErr(message, 400, 'bad request');
};

AppErr.error404 = function(message){
  return new AppErr(message, 404, 'not found');
};

AppErr.error500 = function(message){
  return new AppErr(message, 500, 'internal server error');
};
