'use strict';

const Promise = require('bluebird');
const debug = require('debug')('note:list-crud');

const AppErr = require('./app-err');
const List = require('../model/list');
const noteCurd = require('./note-crud');

exports.createList = function (reqBody){
  debug('createList');
  if(!reqBody.name)
    return Promise.reject(AppErr.error400('list requires name'));
  return new List(reqBody).save();
};

exports.fetchList = function(id){
  debug('fetchList');
  return new Promise((resolve, reject) => {
    List.findOne({_id: id})
    .then( note => resolve(note))
    .catch( err => reject(AppErr.error404(err.message)));
  });
};

exports.updateList = function(id, reqBody){
  debug('updateList');
  return new Promise((resolve, reject) => {
    if (!id)
      return reject(AppErr.error400('must provide id'));
    if (!reqBody.name)
      return reject(AppErr.error400('must promvide new name'));
    this.fetchList(id)
    .then( list => List.update({_id: list._id}, reqBody))
    .then( list => resolve(list))
    .catch( err => reject(err));
  });
};

exports.removeList = function(id){
  debug('removeList');
  return new Promise((resolve, reject) => {
    if (!id)
      reject(AppErr.error400('must provide id'));

    this.fetchList(id)
    .then( list => {
      noteCurd.removeListNotes(list.id)
      return list;
    })
    .then( list => List.remove({_id: list.id}))
    .then( _ => resolve())
    .catch(err => reject(err));
  });
};

exports.removeAllLists = function(){
  debug('removeAllLists');
  return List.remove({});
};

exports.fetchAllLists = function(limit, offset){
  debug('fetchList');
  return List.find({}).limit(limit).skip(offset);
};
