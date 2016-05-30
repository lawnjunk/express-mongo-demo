'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';
const port = process.env.PORT || 3000;

const co = require('co');
const Promse = require('bluebird');
const server = require('../server');
const expect = require('chai').expect;
const listCrud = require('../lib/list-crud');
const noteCrud = require('../lib/note-crud');
const debug = require('debug')('list:list-router-test');
const request = require('./lib/request')(`localhost:${port}/api`);

describe('testing module list-router for bad requests', function(){
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

  describe('testing POST /api/list', function(){
    describe('with no post body', function(){
      it('shold return stauts code 400', function(done){
        request.post('/list').send({})
        .catch( err => {
          expect(err.response.status).to.equal(400);
          expect(err.response.text).to.equal('bad request');
          done();
        });
      });
    });
  });

  describe('testing GET /api/list/:id with bad id', function(){
    it('shold return status code 400', (done) => {
      request.get('/list/1234')
      .catch( err => {
        expect(err.response.status).to.equal(404);
        expect(err.response.text).to.equal('not found');
        done();
      });
    });
  });

  describe('testing PUT /api/list/:id with no body', function(){
    describe('with no json body', function(){
      before((done) => {
        co((function* (){
          this.tempList = yield listCrud.createList({name: 'test data'});
          done();
        }).bind(this)).catch(done);
      });

      after((done) => {
        co(function* (){
          yield listCrud.removeAllLists()
          done();
        }).catch(done);
      });

      it('should return a list', (done) => {
        request.put(`/list/${this.tempList._id}`).send({})
        .catch( err => {
          expect(err.response.status).to.equal(400);
          expect(err.response.text).to.equal('bad request');
          done();
        });
      });
    });

    describe('testing PUT /api/list/:id with bad id', function(){
      it('should return a list', (done) => {
        request.put(`/list/1234`).send({name: 'wat'})
        .catch( err => {
          expect(err.response.status).to.equal(404);
          expect(err.response.text).to.equal('not found');
          done();
        });
      });
    });
  });

  describe('testing DELETE /api/list/:id with bad id', function(){
    it('should return a list', (done) => {
      request.del('/list/1234')
      .catch( err => {
        expect(err.response.status).to.equal(404);
        expect(err.response.text).to.equal('not found');
        done();
      });
    });
  });

  describe('testing GET /api/list/:id/notes', function(){
    describe('with bad id', () => {
      it('should return a array of three notes', (done) => {
        request.get(`/list/1234/notes`)
        .catch( err => {
          expect(err.response.status).to.equal(404);
          expect(err.response.text).to.equal('not found');
          done();
        });
      });
    });

    describe('with no string ?limit=-2', () => {
      it('should return a array of two notes', (done) => {
        co((function* (){
          const res = yield request.get(`/list/1234/notes?limit=2`)
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          done();
        }).bind(this)).catch(done);
      });
    });

    describe('with no string ?limit=-1&offset=2', () => {
      it('should return a array of one note', (done) => {
        co((function* (){
          const res = yield request.get(`/list/1234/notes?limit=2&offset=2`)
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);
          done();
        }).bind(this)).catch(done);
      });
    });
  });

  describe('testing GET /api/lists', function(){
    before((done) => {
      co((function* (){
        this.a = yield listCrud.createList({name: 'test data one '});
        this.b = yield listCrud.createList({name: 'test data two '});
        this.c = yield listCrud.createList({name: 'test data three'});
        this.tempLists = yield [this.a, this.b, this.c];
        done();
      }).bind(this)).catch(done);
    });

    after((done) => {
      co(function* (){
        yield listCrud.removeAllLists()
        done();
      }).catch(done);
    });

    describe('with no query string', () => {
      it('should return a array of three lists', (done) => {
        co((function* (){
          const res = yield request.get('/lists');
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
          done();
        }).bind(this)).catch(done);
      });
    });

    describe('with no string ?limit=2', () => {
      it('should return a array of two list', (done) => {
        co((function* (){
          const res = yield request.get('/lists?limit=2');
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          done();
        }).bind(this)).catch(done);
      });
    });

    describe('with no string ?limit=2&offset=2', () => {
      it('should return a array of one list', (done) => {
        co((function* (){
          const res = yield request.get('/lists?limit=2&offset=2');
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);
          done();
        }).bind(this)).catch(done);
      });
    });
  });
});
