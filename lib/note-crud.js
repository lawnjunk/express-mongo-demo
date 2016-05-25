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
    Note.find({noteID: id}, (err, data) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }

      if (data.length === 1) return  resolve(data[0]);
      err = AppErr.error500('found to many notes');
      resolve(err);
    });
  });
};

exports.removeAllNotes = function(){
  debug('removeAllNotes');
  return new Promise((resolve, reject) => {
    Note.remove({}, (err) => {
      if (err) {
        err = AppErr.error500(err.message);
        return reject(err);
      }
      resolve();
    });
  });
};

