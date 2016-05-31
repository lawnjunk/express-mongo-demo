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

describe('testing module note-router with bad requests', function(){
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
    describe('with bad listId', function(){
      it('should respond with 404', (done) => {
        request.post('/note').send({content: 'test note', listId: 1234})
        .catch(err => {
          expect(err.response.status).to.equal(404);
          expect(err.response.text).to.equal('not found');
          done();
        });
      });
    });

    describe('with no listId', function(){
      it('should resond with 400', (done) => {
        request.post('/note').send({content: 'test note'})
        .catch(err => {
          expect(err.response.status).to.equal(400);
          expect(err.response.text).to.equal('bad request');
          done();
        });
      });
    });

    describe('with no content', function(){
      it('should resond with 400', (done) => {
        request.post('/note').send({listId: 1234})
        .catch(err => {
          expect(err.response.status).to.equal(400);
          expect(err.response.text).to.equal('bad request');
          done();
        });
      });
    });
  });

  describe('testing GET /api/note/:id', function(){
    describe('with bad id', function(){
      it('should resond with 404', (done) => {
        request.get('/note/1234')
        .catch(err => {
          expect(err.response.status).to.equal(404);
          expect(err.response.text).to.equal('not found');
          done();
        });
      });
    });
  });

  describe('testing PUT /api/note/:id', function(){
    describe('with no content', function(){
      before((done) => {
        co((function* (){
          this.tempList = yield listCrud.createList({name: 'todo'});
          this.tempNote = yield noteCrud.createNote({content: 'test note', listId: this.tempList.id});
          done();
        }).bind(this)).catch(done);
      });

      after((done) => {
        co(function* (){
          yield noteCrud.removeAllNotes();
          done();
        }).catch(done);
      });

      it('shoudl return a 400', (done) => {
        request.put(`/note/${this.tempNote.id}`).send({})
        .catch( err => {
          expect(err.response.status).to.equal(400);
          expect(err.response.text).to.equal('bad request');
          done();
        });
      });
    });

    describe('with bad id', function(){
      it('should return a 404', function(done){
        request.put('/note/1234').send({content: 'test data'})
        .catch( err => {
          expect(err.response.status).to.equal(404);
          expect(err.response.text).to.equal('not found');
          done();
        });
      });
    });
  });

  describe('testing DELETE /api/note/:id', function(){
    it('should return a 404', (done) => {
      request.del('/note/1234')
      .catch( err => {
        expect(err.response.status).to.equal(404);
        expect(err.response.text).to.equal('not found');
        done();
      });
    });
  });
});
