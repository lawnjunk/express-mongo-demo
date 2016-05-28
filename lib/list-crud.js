'use strict';

const Promise = require('bluebird');
const debug = require('debug')('note:list-crud');

const AppErr = require('./app-err');
const List = require('../model/list');

exports.createList = function (reqBody){
  debug('createList');
  return new Promise((resolve, reject) => {
    if(!reqBody.name){
      var err = AppErr.error400('list requires name');
      return reject(err);
    }
    var list = new List(reqBody);
    list.save((err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }
      resolve(data);
    });
  });
};

exports.fetchList = function(id){
  debug('fetchList');
  return new Promise((resolve, reject) => {
    if (!id) {
      var err = AppErr.error400('must provide id');
      return reject(err);
    }
    List.find({_id: id}, (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }

      if (data.length === 1) return  resolve(data[0]);
      err = AppErr.error500('found to many lists');
      reject(err);
    });
  });
};

exports.updateList = function(id, reqBody){
  debug('updateList');
  return new Promise((resolve, reject) => {
    if (!id) {
      var err = AppErr.error400('must provide id');
      return reject(err);
    }
    List.update({_id: id}, reqBody, (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }
      if (data.ok && data.nModified > 0) return resolve(); 
      return reject(new AppErr.error404(data));
    });
    
  });
};

exports.deleteList = function(id){
  debug('deleteList');
  return new Promise((resolve, reject) => {
    if (!id) {
      var err = AppErr.error400('must provide id');
      return reject(err);
    }
    List.remove({_id: id}, (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }

      if (data.result.ok && data.result.n == 1) resolve();
      reject(new AppErr.error404());
    });
  });
};

exports.removeAllLists = function(){
  debug('removeAllLists');
  return new Promise((resolve, reject) => {
    List.remove({}, (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }
      resolve();
    });
  });
};

exports.fetchAllLists = function(limit, offset){
  debug('fetchList');
  return new Promise((resolve, reject) => {
    List.find({}).limit(limit).skip(offset).exec((err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }

      resolve(data);
    });
  });
};
