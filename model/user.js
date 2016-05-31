'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');
const AppErr = require('../lib/app-err');
const debug = require('debug')('note:user');
const bcrypt = require('bcrypt');
mongoose.Promise = Promise;


const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

userSchema.methods.generateHash = function(password){
  debug('generateHash');
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, encrypted) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }
      this.password = encrypted;
      resolve();
    });
  });
};

userSchema.methods.compareHash = function(password){
  debug('compareHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function(err, result){
      if (err) return reject(err);
      if (!result) {
        err = new AppErr.error401('wrong password');
        return reject(err);
      }
      resolve();
    });
  });
};

module.exports = mongoose.model('User', userSchema);
