'use strict';

const co = require('co');
const Router = require('express').Router;
const userCrud = require('../lib/user-crud');
const basicAuth = require('../lib/basic-auth');
const jsonParser = require('body-parser').json();
const authRouter = module.exports = new Router();
const debug = require('debug')('note:auth-router');

authRouter.post('/signup', jsonParser, (req, res, next) => {
  debug('POST /signup');
  co(function*(){
    yield userCrud.createUser(req.body);
    res.json({msg: 'success'});
  }).catch(next);
});

authRouter.get('/login', basicAuth , (req, res, next) => {
  debug('GET /login');
  co(function*(){
    const user = yield userCrud.fetchUser(req.auth);
    res.json(user);
  }).catch(next);
});
