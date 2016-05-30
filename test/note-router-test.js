'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';
const port = process.env.PORT || 3000;

const co = require('co');
const server = require('../server');
const expect = require('chai').expect;
const noteCrud = require('../lib/note-crud');
const listCrud = require('../lib/list-crud');
const debug = require('debug')('note:note-router-test');
const request = require('./lib/request')(`localhost:${port}/api`);

describe('testing module note-router', function(){
  before((done) => {
    if(!server.isRunning){
      server.listen(port, function(){
        debug('server.listen');
        console.log('server up !!!', port);
        server.isRunning = true;
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning){
      server.close( function(){
        debug('server.close');
        console.log('server down');
        server.isRunning = false;
        done();
      });
      return;
    }
    done();
  });

  describe('testing POST /api/note', function(){
    
    before((done) => {
      co((function* (){
        this.tempList = yield listCrud.createList({name: 'todo'});
        done();
      }).bind(this)).catch(done);
    });

    after((done) => {
      co(function* (){
        yield noteCrud.removeAllNotes()
        done();
      }).catch(done);
    });

    it('should return a note', (done) => {
      co((function* (){
        const res = yield request.post('/note').send({content: 'test note', listId: this.tempList.id });
        expect(res.status).to.equal(200);
        const note = res.body
        expect(note.content).to.equal('test note');
        expect(note.listId).to.equal(this.tempList.id);
        done();
      }).bind(this)).catch(done);
    });
  });

  describe('testing GET /api/note/:id', function(){
    before((done) => {
      co((function* (){
        this.tempList = yield listCrud.createList({name: 'todo'});
        this.tempNote = yield noteCrud.createNote({content: 'test note', listId: this.tempList.id});
        done();
      }).bind(this)).catch(done);
    });

    after((done) => {
      co(function* (){
        yield noteCrud.removeAllNotes()
        done();
      }).catch(done);
    });

    it('should return a note', (done) => {
      co((function* (){
        const res = yield request.get(`/note/${this.tempNote.id}`)
        expect(res.status).to.equal(200);
        const note = res.body;
        expect(note.content).to.equal(this.tempNote.content);
        expect(note.content).to.equal('test note');
        expect(note.listId).to.equal(this.tempList.id);
        done();
      }).bind(this)).catch(done);
    });

  });

  describe('testing PUT /api/note/:id', function(){
    before((done) => {
      co((function* (){
        this.tempList = yield listCrud.createList({name: 'todo'});
        this.tempNote = yield noteCrud.createNote({content: 'test note', listId: this.tempList.id});
        done();
      }).bind(this)).catch(done);
    });

    after((done) => {
      co(function* (){
        yield noteCrud.removeAllNotes()
        done();
      }).catch(done);
    });

    it('should return a note', (done) => {
      co((function* (){
        const res = yield request.put(`/note/${this.tempNote.id}`).send({content: 'booya'})
        expect(res.status).to.equal(200);
        const note = res.body;
        expect(note.content).to.equal('booya');
        expect(note.listId).to.equal(this.tempList.id);
        done();
      }).bind(this)).catch(done);
    });

  });

  describe('testing DELETE /api/note/:id', function(){
    before((done) => {
      co((function* (){
        this.tempNote = yield noteCrud.createNote({content: 'test data'});
        done();
      }).bind(this)).catch(done);
    });

    after((done) => {
      co(function* (){
        yield noteCrud.removeAllNotes()
        done();
      }).catch(done);
    });

    it('should return a note', (done) => {
      co((function* (){
        const res = yield request.del(`/note/${this.tempNote.id}`)
        expect(res.status).to.equal(200);
        done();
      }).bind(this)).catch(done);
    });

  });
});
