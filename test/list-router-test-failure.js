'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';
const port = process.env.PORT || 3000;

const co = require('co');
const server = require('../server');
const expect = require('chai').expect;
const listCrud = require('../lib/list-crud');
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
    it('shold return status code 404', (done) => {
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
          yield listCrud.removeAllLists();
          done();
        }).catch(done);
      });

      it('should respond with 400 "bad request"', (done) => {
        request.put(`/list/${this.tempList._id}`).send({})
        .catch( err => {
          expect(err.response.status).to.equal(400);
          expect(err.response.text).to.equal('bad request');
          done();
        });
      });
    });

    describe('testing PUT /api/list/:id with bad id', function(){
      it('should respond with 404 "not found"', (done) => {
        request.put('/list/1234').send({name: 'wat'})
        .catch( err => {
          expect(err.response.status).to.equal(404);
          expect(err.response.text).to.equal('not found');
          done();
        });
      });
    });
  });

  describe('testing DELETE /api/list/:id with bad id', function(){
    it('should respond with 404 "not found"', (done) => {
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
      it('should respond with 404 "not found"', (done) => {
        request.get('/list/1234/notes')
        .catch( err => {
          expect(err.response.status).to.equal(404);
          expect(err.response.text).to.equal('not found');
          done();
        });
      });
    });

    describe('with no string ?limit=-2', () => {
      it('should respond with 400 "bad request"', (done) => {
        request.get('/list/1234/notes?limit=-2')
        .catch( err => {
          expect(err.response.status).to.equal(400);
          expect(err.response.text).to.equal('bad request');
          done();
        });
      });
    });

    describe('with no string ?limit=0', () => {
      it('should respond with 400 "bad request"', (done) => {
        request.get('/list/1234/notes?limit=0')
        .catch( err => {
          expect(err.response.status).to.equal(400);
          expect(err.response.text).to.equal('bad request');
          done();
        });
      });
    });

    describe('with no string ?offset=-1', () => {
      it('should respond with 400 "bad request"', (done) => {
        request.get('/list/1234/notes?limit=-1')
        .catch( err => {
          expect(err.response.status).to.equal(400);
          expect(err.response.text).to.equal('bad request');
          done();
        });
      });
    });
  });
});
