'use strict';

const AppErr = require('./app-err');
const debug = require('debug')('note:err-response');
const log = require('./log');

module.exports = function(err, req, res, next){
  debug('sendErr');
  log.err(err.message);
  if(AppErr.isAppErr(err)){
    debug('err isAppErr');
    res.status(err.status).send(err.response);
    return;
  }
  res.status(500).send('internal server error');
  next();
};
