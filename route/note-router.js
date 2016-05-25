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

noteRouter.post('/', bodyParser, function(req, res) {
  debug('POST route /api/note');
  co((function* (){
    const note = yield noteCrud.createNote(req.body);
    res.json(note);
  }).bind(this)).catch((err) => {
    res.sendErr(err);
  });
});

noteRouter.get('/:id', function(req, res) {
  debug('GET route /api/note/:id ');
  co((function* (){
    const note = yield noteCrud.fetchNote(req.params.id);
    res.json(note);
  }).bind(this)).catch((err) => {
    res.sendErr(err);
  });
});
