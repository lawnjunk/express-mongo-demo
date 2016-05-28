'use strict';

// node moduels
// npm moduels
const co = require('co');
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('note:note-router');

// app moduels
const noteCrud = require('../lib/note-crud');

// globals -- module
const noteRouter = module.exports = new Router();

noteRouter.post('/note/', bodyParser, function(req, res, next) {
  debug('POST route /api/note');
  co((function* (){
    const note = yield noteCrud.createNote(req.body);
    res.json(note);
  }).bind(this)).catch(next);
});

noteRouter.get('/note/:id', function(req, res, next) {
  debug('GET route /api/note/:id ');
  co((function* (){
    const note = yield noteCrud.fetchNote(req.params.id);
    res.json(note);
  }).bind(this)).catch(next);
});

noteRouter.put('/note/:id',bodyParser,function(req, res, next) {
  debug('GET route /api/note/:id ');
  co((function* (){
    yield noteCrud.updateNote(req.params.id, req.body);
    const note = yield noteCrud.fetchNote(req.params.id);
    res.json(note);
  }).bind(this)).catch(next);
});

noteRouter.delete('/note/:id',bodyParser,function(req, res, next) {
  debug('GET route /api/note/:id ');
  co((function* (){
    const note = yield noteCrud.deleteNote(req.params.id);
    res.json(note);
  }).bind(this)).catch(next);
});
