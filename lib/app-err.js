'use strict';

const debug = require('debug');

const AppErr = module.exports = function(message, status, response){
  Error.call(this);
  this.message = message;
  this.status = status;
  this.response = response;
};

AppErr.prototype = Object.create(Error.prototype);

AppErr.isAppErr = function(err){
  debug('isAppErr');
  return err instanceof AppErr;
};

AppErr.error400 = function(message){
  debug('error400');
  return new AppErr(message, 400, 'bad request');
};

AppErr.error401 = function(message){
  debug('error401');
  return new AppErr(message, 401, 'unauthorized');
};

AppErr.error404 = function(message){
  debug('error404');
  return new AppErr(message, 404, 'not found');
};

AppErr.error500 = function(message){
  debug('error500');
  return new AppErr(message, 500, 'internal server error');
};
