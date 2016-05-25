'use strict';

const AppErr = require('./app-err');
const debug = require('debug')('note:err-response');

module.exports = function(req, res, next){
  res.sendErr = function(err){
    debug('sendErr');
    console.error(err.message);
    if(AppErr.isAppErr(err)){
      debug('err isAppErr');
      res.status(err.status).send(err.response);
      return;
    }
    res.status(500).sendErr('internal server error');
  }; 
  next();
};
