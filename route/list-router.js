'use strict';

// node moduels
// npm moduels
const co = require('co');
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('list:list-router');

// app moduels
const AppErr = require('../lib/app-err');
const listCrud = require('../lib/list-crud');
const noteCrud = require('../lib/note-crud');
const parseQuery = require('../lib/parse-query');

// globals -- module
const listRouter = module.exports = new Router();

listRouter.post('/list', bodyParser, function(req, res, next) {
  debug('POST route /api/list');
  co((function* (){
    const list = yield listCrud.createList(req.body);
    res.json(list);
  }).bind(this)).catch(next);
});

listRouter.get('/list/:id', function(req, res, next) {
  debug('GET route /api/list/:id ');
  co((function* (){
    const list = yield listCrud.fetchList(req.params.id);
    res.json(list);
  }).bind(this)).catch(next);
});

listRouter.put('/list/:id',bodyParser,function(req, res, next) {
  debug('GET route /api/list/:id ');
  co((function* (){
    yield listCrud.updateList(req.params.id, req.body);
    const list = yield listCrud.fetchList(req.params.id);
    res.json(list);
  }).bind(this)).catch(next);
});

listRouter.delete('/list/:id',bodyParser,function(req, res, next) {
  debug('GET route /api/list/:id ');
  co((function* (){
    yield noteCrud.removeListNotes(req.params.id);
    const list = yield listCrud.deleteList(req.params.id);
    res.json(list);
  }).bind(this)).catch(next);
});

listRouter.get('/list/:id/notes', parseQuery, function(req, res, next){
  debug('GET route /api/list/:id/notes');
  co((function* (){
    const notes = yield noteCrud.fetchListNotes(req.params.id, req.query.limit, req.query.offset);
    return res.json(notes);
  }).bind(this)).catch(next);
});

listRouter.get('/lists', parseQuery, function(req, res, next){
  debug('GET route /api/list/:id/notes');
  co((function* (){
    const lists =  yield listCrud.fetchAllLists(req.query.limit, req.query.offset);
    return res.json(lists);
  }).bind(this)).catch(next);
});
