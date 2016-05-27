'use strict';

const Promise = require('bluebird');
const debug = require('debug')('note:note-crud');

const AppErr = require('./app-err');
const Note = require('../model/note');

exports.createNote = function (reqBody){
  debug('createNote');
  return new Promise((resolve, reject) => {
    if(!reqBody.content){
      var err = AppErr.error400('note requires content');
      return reject(err);
    }
    var note = new Note(reqBody);
    note.save((err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }
      resolve(data);
    });
  });
};

exports.fetchNote = function(id){
  debug('fetchNote');
  return new Promise((resolve, reject) => {
    if (!id) {
      var err = AppErr.error400('note requires content');
      return reject(err);
    }
    Note.find({_id: id}, (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }

      if (data.length === 1) return  resolve(data[0]);
      err = AppErr.error500('found to many notes');
      reject(err);
    });
  });
};

exports.updateNote = function(id, reqBody){
  debug('updateNote');
  return new Promise((resolve, reject) => {
    if (!id) {
      var err = AppErr.error400('note requires content');
      return reject(err);
    }
    Note.update({_id: id}, reqBody, (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }
      if (data.ok && data.nModified > 0) return resolve(); 
      return reject(new AppErr.error404(data));
    });
    
  });
};

exports.deleteNote = function(id){
  debug('deleteNote');
  return new Promise((resolve, reject) => {
    if (!id) {
      var err = AppErr.error400('note requires content');
      return reject(err);
    }
    Note.remove({_id: id}, (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }

      if (data.result.ok && data.result.n == 1) resolve();
      reject(new AppErr.error404());
    });
  });
};

exports.removeAllNotes = function(){
  debug('removeAllNotes');
  return new Promise((resolve, reject) => {
    Note.remove({}, (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }
      resolve();
    });
  });
};

exports.fetchListNotes = function(listId, limit, offset){
  debug('fetchNote');
  return new Promise((resolve, reject) => {
    if (!listId) {
      var err = AppErr.error400('must provide listId');
      return reject(err);
    }
    Note.find({}).limit(limit).skip(offset).exec( (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }
      resolve(data);
    });
  });
};
