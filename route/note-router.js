'use strict';

// node moduels
// npm moduels
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('note:note-router');

// app moduels
const noteCrud = require('../lib/note-crud');

// globals -- module
const noteRouter = module.exports = new Router();

noteRouter.post('/note/', bodyParser, function(req, res, next) {
  debug('POST route /api/note');
  noteCrud.createNote(req.body)
  .then( note => res.json(note))
  .catch(next);
});

noteRouter.get('/note/:id', function(req, res, next) {
  debug('GET route /api/note/:id ');
  noteCrud.fetchNote(req.params.id)
  .then( note => res.json(note))
  .catch(next);
});

noteRouter.put('/note/:id',bodyParser,function(req, res, next) {
  debug('GET route /api/note/:id ');
  noteCrud.updateNote(req.params.id, req.body)
  .then( note => res.json(note))
  .catch(next);
});

noteRouter.delete('/note/:id',bodyParser,function(req, res, next) {
  debug('GET route /api/note/:id ');
  noteCrud.removeNote(req.params.id)
  .then( msg => res.json(msg))
  .catch(next);
});
