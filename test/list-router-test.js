'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';
const port = process.env.PORT || 3000;

const co = require('co');
const server = require('../server');
const expect = require('chai').expect;
const listCrud = require('../lib/list-crud');
const noteCrud = require('../lib/note-crud');
const debug = require('debug')('list:list-router-test');
const request = require('./lib/request')(`localhost:${port}/api`);

describe('testing module list-router', function(){
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
    after((done) => {
      co(function* (){
        yield listCrud.removeAllLists()
        done();
      }).catch(done);
    });

    it('should return a list', function(done){
      co(function* (){
        const res = yield request.post('/list').send({name: 'test list'});
        expect(res.status).to.equal(200);
        done();
      }).catch(done);
    });
  });

  describe('testing GET /api/list/:id', function(){
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
      co((function* (){
        const res = yield request.get(`/list/${this.tempList.id}`)
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(this.tempList.name);
        done();
      }).bind(this)).catch(done);
    });

  });

  describe('testing PUT /api/list/:id', function(){
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
      co((function* (){
        const res = yield request.put(`/list/${this.tempList.id}`).send({name: 'booya'})
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('booya');
        done();
      }).bind(this)).catch(done);
    });

  });

  describe('testing DELETE /api/list/:id', function(){
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
      co((function* (){
        const res = yield request.del(`/list/${this.tempList.id}`)
        expect(res.status).to.equal(200);
        done();
      }).bind(this)).catch(done);
    });

  });

  describe('testing GET /api/list/:id/notes', function(){
    before((done) => {
      co((function* (){
        this.tempList = yield listCrud.createList({name: 'test data'});
        const a = noteCrud.createNote({content: 'test data one', listId: this.tempList.id});
        const b = noteCrud.createNote({content: 'test data two', listId: this.tempList.id});
        const c = noteCrud.createNote({content: 'test data three', listId: this.tempList.id});
        this.tempNotes = yield [a, b, c];
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
      it('should return a list of three notes', (done) => {
        co((function* (){
          const res = yield request.get(`/list/${this.tempList.id}/notes`)
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
          done();
        }).bind(this)).catch(done);
      });
    });

    describe('with no string ?limit=2', () => {
      it('should return a list of two notes', (done) => {
        co((function* (){
          const res = yield request.get(`/list/${this.tempList.id}/notes?limit=2`)
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          done();
        }).bind(this)).catch(done);
      });
    });

    describe('with no string ?limit=2&offset=2', () => {
      it('should return a list of one notes', (done) => {
        co((function* (){
          const res = yield request.get(`/list/${this.tempList.id}/notes?limit=2&offset=2`)
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);
          done();
        }).bind(this)).catch(done);
      });
    });
  });
});
