'use strict';

const Promise = require('bluebird');
const debug = require('debug')('note:note-crud');

const AppErr = require('./app-err');
const Note = require('../model/note');
const listCrud = require('./list-crud');

exports.createNote = function (reqBody){
  debug('createNote');
  return new Promise((resolve, reject) => {
    if (!reqBody.content) return reject(AppErr.error400('note requires content'));
    if (!reqBody.listId) return reject(AppErr.error400('note requires listId'));
    listCrud.fetchList(reqBody.listId)
    .then( list => new Note({content: reqBody.content, listId: list._id}).save())
    .then( note => resolve(note))
    .catch(reject);
  });
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
  return new Promise(( resolve, reject) => {
    if (!id)
      return reject(AppErr.error400('noteCrud requires id'));
    if (!reqBody.content){
      return reject(AppErr.error400('noteCrud requires content'));
    }
    this.fetchNote(id)
    .then( note => Note.update({_id: note._id}, reqBody))
    .then( () => this.fetchNote(id))
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
    .then( () => resolve())
    .catch( err => reject(err));
  });
};

exports.fetchListNotes = function(listId, limit, offset){
  debug('fetchNote');
  return new Promise((resolve, reject) => {
    if (!listId)
      return reject(AppErr.error400('must provide listId'));
    listCrud.fetchList(listId)
    .then( list => Note.find({listId: list._id}).limit(limit).skip(offset))
    .then( notes => resolve(notes))
    .catch(reject);
  });
};

exports.removeListNotes = function(listId){
  debug('removeListNotes');
  return new Promise((resolve, reject) => {
    Note.remove({listId: listId})
    .then( status => resolve(status))
    .catch(reject);
  });
};

exports.removeAllNotes = function(){
  debug('removeAllNotes');
  return  Note.remove({});
};
