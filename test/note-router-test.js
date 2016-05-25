'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';
const port = process.env.PORT || 3000;

const co = require('co');
const server = require('../server');
const expect = require('chai').expect;
const noteCrud = require('../lib/note-crud');
const debug = require('debug')('note:note-router-test');
const request = require('./lib/request')(`localhost:${port}/api/note`);

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
    after((done) => {
      co(function* (){
        yield noteCrud.removeAllNotes()
        done();
      }).catch(done);
    });

    it('should return a note', function(done){
      co(function* (){
        const res = yield request.post('/').send({content: 'test note'});
        expect(res.status).to.equal(200);
        done();
      }).catch(done);
    });
  });

  describe('testing GET /api/note/:id', function(){
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
        const res = yield request.get(`/${this.tempNote.noteID}`)
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal(this.tempNote.content);
        done();
      }).bind(this)).catch(done);
    });
    
  });
});
