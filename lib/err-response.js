'use strict';

const AppErr = require('./app-err');
const debug = require('debug')('note:err-response');

module.exports = function(err, req, res, next){
  debug('sendErr');
  log.error(err.message);
  if(AppErr.isAppErr(err)){
    debug('err isAppErr');
    res.status(err.status).send(err.response);
    return;
  }
  res.status(500).send('internal server error');
  next();
};
