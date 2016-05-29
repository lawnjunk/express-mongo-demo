'use strict';

const co = require('co');
const Promise = require('bluebird');
const AppErr = require('./app-err');
const User = require('../model/user');
const debug = require('debug')('note:user-crud');

exports.createUser = function(data){
  return new Promise(function(resolve, reject) {
    co(function* (){

      const password = data.password;
      data.password = null;
      if (!password) {
        let err = AppErr.error400('must provide password');
        return reject(err);
      }

      const user = new User(data);
      yield user.generateHash(password);
      user.save((err, data) => {
        if (err) {
          err = AppErr.error500(err.message);
          return reject(err);
        }
        resolve();
      });
    }).catch(reject);
  });
};

exports.fetchUser = function(auth){
  return new Promise(function(resolve, reject) {
    User.findOne({username: auth.username} , function(err, user){
      co(function* (){
        if (err) {
          let err = AppErr.error500(err.message);
          return reject(err);
        }
        if (!user) {
          let err = AppErr.error401('user not found');
          return reject(err);
        }
        yield user.compareHash(auth.password);
        resolve(user);
      }).catch(reject);
    });
  });
};


exports.removeAllUsers = function(){
  return new Promise((resolve, reject) => {
    User.remove({}, function(err){
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};
