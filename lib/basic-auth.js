'use strict';

const debug = require('debug')('note:basic-auth');
const AppErr = require('../lib/app-err');

module.exports = function(req, res, next) {
  debug('basicAuth');
  var authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = AppErr.error401('auth requires username and password');
    return next(err);
  }
  console.log('authHeader', authHeader);
  let auth = authHeader.split(' ')[1];
  console.log('auth', auth);
  const  authBuf = new Buffer(auth, 'base64');
  auth = authBuf.toString();
  authBuf.fill(0);
  auth = auth.split(':');
  req.auth = {
    username: auth[0],
    password: auth[1]
  };
  if (req.auth.username.length < 1 || req.auth.password.length < 1){
    const err = AppErr.error401('auth requires username and password');
    return next(err);
  } 
  next();
};

