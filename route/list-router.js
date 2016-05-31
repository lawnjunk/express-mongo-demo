'use strict';

// node moduels
// npm moduels
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('list:list-router');

// app moduels
const listCrud = require('../lib/list-crud');
const noteCrud = require('../lib/note-crud');
const parseQuery = require('../lib/parse-query');

// globals -- module
const listRouter = module.exports = new Router();

listRouter.post('/list', bodyParser, function(req, res, next) {
  debug('POST route /api/list');
  listCrud.createList(req.body)
  .then(list => res.json(list))
  .catch(next);
});

listRouter.get('/list/:id', function(req, res, next) {
  debug('GET route /api/list/:id ');
  listCrud.fetchList(req.params.id)
  .then( list => res.json(list))
  .catch(next);
});

listRouter.put('/list/:id',bodyParser,function(req, res, next) {
  debug('GET route /api/list/:id ');
  listCrud.updateList(req.params.id, req.body)
  .then( () => listCrud.fetchList(req.params.id))
  .then( list => res.json(list))
  .catch(next);
});

listRouter.delete('/list/:id',bodyParser,function(req, res, next) {
  debug('GET route /api/list/:id ');
  listCrud.removeList(req.params.id)
  .then( () => res.status(204).send())
  .catch(next);
});

listRouter.get('/list/:id/notes', parseQuery, function(req, res, next){
  debug('GET route /api/list/:id/notes');
  noteCrud.fetchListNotes(req.params.id, req.query.limit, req.query.offset)
  .then( notes => res.json(notes))
  .catch(next);
});

listRouter.get('/lists', parseQuery, function(req, res, next){
  debug('GET route /api/list/:id/notes');
  listCrud.fetchAllLists(req.query.limit, req.query.offset)
  .then( lists => res.json(lists))
  .catch(next);
});
