'use strict';

const Promise = require('bluebird');
const debug = require('debug')('note:note-crud');

const AppErr = require('./app-err');
const Note = require('../model/note');

exports.createNote = function (reqBody){
  debug('createNote');
  if (!reqBody.content) return Promise.reject(AppErr.error400('note requires content'));
  return new Note(reqBody).save();
};

exports.fetchNote = function(id){
  debug('fetchNote');
  return new Promise((resolve, reject) => {
    if (!id)
      return reject(AppErr.error400('note requires content'));
    Note.findOne({_id: id})
    .then( note => resolve(note))
    .catch( err => reject(AppErr.error404(err.message)));
  });
};

exports.updateNote = function(id, reqBody){
  debug('updateNote');
  return new Promise(( resolve, rejec) => {
    if (!id)
      return reject(AppErr.error400('note requires content'));
    this.fetchNote(id)
    .then( note => Note.update({_id: note._id}, reqBody))
    .then( note => resolve(note))
    .catch( err => reject(err));
  });
};

exports.removeNote = function(id){
  debug('removeNote');
  return new Promise((resolve, reject) => {
    if (!id)
      return reject(AppErr.error400('note requires content'));
    this.fetchNote(id)
    .then( note => Note.remove({_id: note._id}))
    .then( _ => resolve())
    .catch( err => reject(err));
  });
};

exports.fetchListNotes = function(listId, limit, offset){
  debug('fetchNote');
  return new Promise((resolve, reject) => {
    if (!listId)
      return reject(AppErr.error400('must provide listId'));
    Note.find({listId: listId}).limit(limit).skip(offset)
    .then( notes => resolve(notes))
    .catch( err => resolve(AppErr.error404(err.message)));
  });
};

exports.removeListNotes = function(listId){
  debug('removeListNotes');
  return Note.remove({listId: listId});
};

exports.removeAllNotes = function(){
  debug('removeAllNotes');
  return  Note.remove({});
};
